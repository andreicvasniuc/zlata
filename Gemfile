source "https://rubygems.org"

ruby "4.0.9"

gem "rails", "~> 8.1.4"
gem "puma", "~> 8.0"

# MongoDB
gem "mongoid", "~> 9.1"
gem "mongoid-slug", "~> 7.1"

# Admin authentication (User has_secure_password; JWT issued by AuthToken)
gem "bcrypt", "~> 3.1"
gem "jwt", "~> 3.3"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[ windows jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem "debug", platforms: %i[ mri windows ], require: "debug/prelude"

  # Static analysis for security vulnerabilities [https://brakemanscanner.org/]
  gem "brakeman", require: false

  # Audits gems for known security defects (use config/bundler-audit.yml to ignore advisories)
  gem "bundler-audit", require: false

  # Omakase Ruby styling [https://github.com/rails/rubocop-rails-omakase/]
  gem "rubocop-rails-omakase", require: false

  gem "rspec-rails", "~> 8.0"
end

group :development do
  # Cross-Origin Resource Sharing for the webpack dev server (localhost:8080)
  gem "rack-cors", "~> 3.0", require: "rack/cors"
end
