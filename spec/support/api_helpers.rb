module ApiHelpers
  ADMIN_EMAIL = 'admin@example.test'.freeze
  ADMIN_PASSWORD = 'correct-horse-battery'.freeze

  def json
    JSON.parse(response.body)
  end

  def oid(hash)
    hash.fetch('_id').fetch('$oid')
  end

  def secret_key_base
    # Rails 6.0 reads secrets.yml; Rails 7.2+ removed Rails.application.secrets
    Rails::VERSION::MAJOR < 7 ? Rails.application.secrets.secret_key_base : Rails.application.secret_key_base
  end

  def admin_user
    User.where(email: ADMIN_EMAIL).first || User.create!(email: ADMIN_EMAIL, password: ADMIN_PASSWORD, is_admin: true)
  end

  def jwt_for(user, exp: 1.day.from_now.to_i)
    JWT.encode({ sub: user.id.to_s, exp: exp }, secret_key_base, 'HS256')
  end

  # Logs in through the real endpoint, like the admin frontend does.
  def auth_headers
    admin_user
    api_post '/user_token', { auth: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } }
    expect(response).to have_http_status(:created)
    { 'Authorization' => "Bearer #{json.fetch('jwt')}" }
  end

  # The request helpers take (path, params = {}, headers: {}) written with a plain trailing hash,
  # so the specs run unchanged on Ruby 2.7 (old app) and Ruby 3+/4 (new app).
  def api_get(path, options = {})
    get path, headers: options.fetch(:headers, {}), as: :json
  end

  def api_post(path, params = {}, options = {})
    post path, params: params, headers: options.fetch(:headers, {}), as: :json
  end

  def api_patch(path, params = {}, options = {})
    patch path, params: params, headers: options.fetch(:headers, {}), as: :json
  end

  def api_delete(path, options = {})
    delete path, headers: options.fetch(:headers, {}), as: :json
  end

  def search_body(overrides = {})
    { search: '', pagination: { skip: 0, take: 100 }, sorting: { field: 'updated_at', direction: 'desc' } }.merge(overrides)
  end
end
