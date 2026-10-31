require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot for better performance and memory savings (ignored by Rake tasks).
  config.eager_load = true

  # Full error reports are disabled.
  config.consider_all_requests_local = false

  # Serve the committed frontend build from public/ (Heroku has no web server in front of the dynos).
  # No far-future cache header: public/ also holds un-fingerprinted files (data/*.json, i18n/*.json).
  config.public_file_server.enabled = true

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  # No `assume_ssl`: the Heroku router sends X-Forwarded-Proto, and assuming SSL would switch off the
  # HTTP -> HTTPS redirect this app has always done.
  # Set FORCE_SSL=false only to run this production build over plain HTTP locally (docker-compose.prod.yml).
  config.force_ssl = ENV["FORCE_SSL"] != "false"

  # Log to STDOUT with the current request id as a default log tag.
  config.log_tags = [ :request_id ]
  config.logger   = ActiveSupport::TaggedLogging.logger(STDOUT)

  # Change to "debug" to log everything (including potentially personally-identifiable information!).
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  # Don't log any deprecations.
  config.active_support.report_deprecations = false

  # Raise delivery errors so a failed contact form submission is reported to the visitor.
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.default_url_options = { host: "zlata-weddingfashion.com" }

  config.action_mailer.delivery_method = :smtp
  # SMTP settings for gmail
  config.action_mailer.smtp_settings = {
    address:              "smtp.gmail.com",
    port:                 587,
    user_name:            ENV["gmail_username"],
    password:             ENV["gmail_password"],
    domain:               "zlata-weddingfashion.com",
    authentication:       "plain",
    enable_starttls_auto: true
  }

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true
end
