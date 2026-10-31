# test.rb sets show_exceptions = false, which makes missing records raise inside the request.
# Render them like production does (404/400 responses) so request specs can assert on status codes.
RSpec.configure do |config|
  config.before(type: :request) do
    Rails.application.env_config['action_dispatch.show_exceptions'] = Rails::VERSION::MAJOR >= 7 ? :rescuable : true
    Rails.application.env_config['action_dispatch.show_detailed_exceptions'] = false
  end
end
