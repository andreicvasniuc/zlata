#!/usr/bin/env ruby
# Records the API's responses so two versions of the app can be compared.
#
#   ruby script/api_snapshot.rb snapshot BASE_URL OUT_DIR
#   ruby script/api_snapshot.rb compare DIR_A DIR_B
#
# `snapshot` walks every public endpoint (no locale + en/ua/ru/ro) for every collection
# found in the data. With ADMIN_EMAIL and ADMIN_PASSWORD set it also logs in and records
# the admin read endpoints (list/show/search). It only sends GETs, plus POSTs that do not
# write (login and search). JSON is normalized (keys sorted) so only content differences show.
#
# Uses the standard library only, so it runs in any of the project's containers.
require 'fileutils'
require 'json'
require 'net/http'
require 'uri'

LOCALES = [nil, 'en', 'ua', 'ru', 'ro'].freeze
SEARCH_BODY = {
  search: '', pagination: { skip: 0, take: 1000 }, sorting: { field: 'updated_at', direction: 'desc' }
}.freeze

class Recorder
  attr_reader :count

  def initialize(base_url, out_dir)
    @uri = URI(base_url)
    @out_dir = out_dir
    @count = 0
    @token = nil
    FileUtils.rm_rf(out_dir)
    FileUtils.mkdir_p(out_dir)
  end

  def login(email, password)
    status, body = record(:post, '/user_token', body: { auth: { email: email, password: password } }, save: false)
    raise "admin login failed (HTTP #{status})" unless status == 201

    @token = JSON.parse(body).fetch('jwt')
  end

  # Records a request and returns the parsed JSON body (nil when the body isn't JSON).
  def get(path, headers: {})
    parse(record(:get, path, headers: headers)[1])
  end

  def post(path, body)
    parse(record(:post, path, body: body)[1])
  end

  def admin_get(path)
    get(path, headers: { 'Authorization' => "Bearer #{@token}" })
  end

  def admin_post(path, body)
    parse(record(:post, path, body: body, headers: { 'Authorization' => "Bearer #{@token}" })[1])
  end

  private

  def parse(body)
    JSON.parse(body)
  rescue JSON::ParserError
    nil
  end

  def record(verb, path, body: nil, headers: {}, save: true)
    klass = verb == :post ? Net::HTTP::Post : Net::HTTP::Get
    request = klass.new(path, { 'X-Forwarded-Proto' => 'https' }.merge(headers))
    if body
      request['Content-Type'] = 'application/json'
      request.body = JSON.generate(body)
    end
    response = Net::HTTP.start(@uri.host, @uri.port, use_ssl: @uri.scheme == 'https', read_timeout: 60) { |http| http.request(request) }
    write(verb, path, response) if save
    [response.code.to_i, response.body.to_s]
  end

  def write(verb, path, response)
    name = "#{verb}_#{path.gsub(/[^A-Za-z0-9_.-]+/, '_')}"
    name += "_#{@count}" if File.exist?(File.join(@out_dir, "#{name}.txt")) # same path, different headers/body
    File.write(File.join(@out_dir, "#{name}.txt"), "HTTP #{response.code}\n#{normalize(response)}\n")
    @count += 1
  end

  def normalize(response)
    body = response.body.to_s
    return JSON.pretty_generate(sort(JSON.parse(body))) if response['Content-Type'].to_s.include?('json') && !body.empty?

    text(body)
  rescue JSON::ParserError
    text(body)
  end

  # static files in public/ are CRLF in a Windows checkout and LF on Heroku
  def text(body)
    body.gsub("\r\n", "\n")
  end

  def sort(value)
    case value
    when Hash then value.sort.to_h { |k, v| [k, sort(v)] }
    when Array then value.map { |v| sort(v) }
    else value
    end
  end
end

def ids(list, key = '_id')
  Array(list).map { |item| item[key].is_a?(Hash) ? item[key]['$oid'] : item[key] }.compact
end

def snapshot(base_url, out_dir)
  rec = Recorder.new(base_url, out_dir)
  admin = ENV['ADMIN_EMAIL'] && ENV['ADMIN_PASSWORD']
  rec.login(ENV['ADMIN_EMAIL'], ENV['ADMIN_PASSWORD']) if admin

  # SPA shell, static files, unknown paths, auth failures
  %w[/ /admin /ua /ua/admin /en/admin/collections /robots.txt /sitemap.xml /some/unknown/path].each { |p| rec.get(p) }
  rec.get('/admin/collections/list')
  rec.get('/admin/collections/list', headers: { 'Authorization' => 'Bearer not-a-token' })
  rec.post('/user_token', { auth: { email: 'nobody@example.test', password: 'wrong' } })

  collections = {}
  LOCALES.each do |locale|
    prefix = locale ? "/#{locale}" : ''
    %w[dresses accessories].each do |kind|
      list = rec.get("#{prefix}/api/collections/#{kind}")
      Array(list && list['collections']).each { |c| collections[c['slug']] = c['_id']['$oid'] }
    end
    %w[products/top_list sizes/list colors/list social_networkings/list contact_groups/list sliders/home].each do |p|
      rec.get("#{prefix}/api/#{p}")
    end
  end

  if admin
    LOCALES.each do |locale|
      prefix = locale ? "/#{locale}" : ''
      list = rec.admin_get("#{prefix}/admin/collections/list")
      Array(list && list['collections']).each { |c| collections[c['_slugs']&.first] = c['_id']['$oid'] }
    end
  end

  collections.each do |slug, id|
    LOCALES.each do |locale|
      prefix = locale ? "/#{locale}" : ''
      rec.get("#{prefix}/api/collections/#{slug}")
      rec.get("#{prefix}/api/collections/#{id}")
    end
  end
  LOCALES.each { |l| rec.get("#{l ? "/#{l}" : ''}/api/collections/does-not-exist") }
  rec.get('/api/collections/does-not-exist', headers: { 'Accept' => 'application/json' })

  record_admin(rec, collections.values) if admin
  puts "recorded #{rec.count} responses in #{out_dir}"
end

def record_admin(rec, collection_ids)
  LOCALES.each do |locale|
    prefix = locale ? "/#{locale}" : ''

    %w[collections contact_groups sliders social_networkings].each do |res|
      rec.admin_post("#{prefix}/admin/#{res}/search", SEARCH_BODY)
    end
    %w[sizes colors contact_groups sliders collections].each { |res| rec.admin_get("#{prefix}/admin/#{res}/list") }

    collection_ids.each do |cid|
      collection = rec.admin_get("#{prefix}/admin/collections/#{cid}")
      ids(collection && collection['products']).each { |pid| rec.admin_get("#{prefix}/admin/collections/#{cid}/products/#{pid}") }
    end

    groups = rec.admin_get("#{prefix}/admin/contact_groups/list")
    ids(groups && groups['contactGroups']).each do |gid|
      group = rec.admin_get("#{prefix}/admin/contact_groups/#{gid}")
      ids(group && group['contacts']).each { |id| rec.admin_get("#{prefix}/admin/contact_groups/#{gid}/contacts/#{id}") }
    end

    sliders = rec.admin_get("#{prefix}/admin/sliders/list")
    ids(sliders && sliders['sliders']).each do |sid|
      slider = rec.admin_get("#{prefix}/admin/sliders/#{sid}")
      ids(slider && slider['slides']).each { |id| rec.admin_get("#{prefix}/admin/sliders/#{sid}/slides/#{id}") }
    end

    networks = rec.admin_post("#{prefix}/admin/social_networkings/search", SEARCH_BODY)
    ids(networks && networks['socialNetworkings']).each { |id| rec.admin_get("#{prefix}/admin/social_networkings/#{id}") }
  end
end

def compare(dir_a, dir_b)
  files_a = Dir.children(dir_a).sort
  files_b = Dir.children(dir_b).sort
  only_a = files_a - files_b
  only_b = files_b - files_a
  different = (files_a & files_b).reject { |f| File.read(File.join(dir_a, f)) == File.read(File.join(dir_b, f)) }

  only_a.each { |f| puts "only in #{dir_a}: #{f}" }
  only_b.each { |f| puts "only in #{dir_b}: #{f}" }
  different.each { |f| puts "differs: #{f}" }
  puts "#{(files_a & files_b).size - different.size} identical, #{different.size} different, #{only_a.size + only_b.size} unmatched"
  exit(only_a.empty? && only_b.empty? && different.empty? ? 0 : 1)
end

case ARGV[0]
when 'snapshot' then snapshot(ARGV.fetch(1), ARGV.fetch(2))
when 'compare' then compare(ARGV.fetch(1), ARGV.fetch(2))
else abort(File.read(__FILE__)[/\A(?:#.*\n)+/].gsub(/^# ?/, ''))
end
