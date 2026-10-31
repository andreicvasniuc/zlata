ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../config/environment', __dir__)
abort('The Rails environment is running in production mode!') if Rails.env.production?
abort('Refusing to purge a database that is not a test database') unless Mongoid.default_client.database.name.end_with?('_test')
require 'rspec/rails'
require 'jwt'

Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |file| require file }

RSpec.configure do |config|
  config.infer_spec_type_from_file_location!
  config.filter_run_when_matching :focus
  # run with --tag ~baseline_bug against the old app, which has a known defect these specs describe
  config.disable_monkey_patching!
  config.order = :random

  config.include ApiHelpers, type: :request
  config.include ActiveSupport::Testing::TimeHelpers

  config.before do
    Mongoid.purge!
    ActionMailer::Base.deliveries.clear
    I18n.locale = I18n.default_locale # controllers set I18n.locale and never reset it
  end
end
