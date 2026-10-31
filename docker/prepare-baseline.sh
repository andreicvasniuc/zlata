#!/bin/sh
# Prepares ../zlata-baseline so the ORIGINAL app runs again. Create that directory with:
#   git -c core.autocrlf=false archive master | tar -x -C ../zlata-baseline
# What changes (baseline copy only, never the real repo):
#  - mimemagic 0.3.5 (locked) was yanked from RubyGems; Rails 6.0.6.1 no longer needs it
#  - concurrent-ruby >= 1.3.5 no longer requires 'logger', which Rails 6.0 relies on
#  - rspec-rails is added so the shared request specs (./spec) can run against the old app too
#  - mongoid.yml reads the Mongo host from MONGO_HOST (it hard-codes localhost)
# Runs inside the baseline container.
set -eu
cd /app
sed -i "s/^ruby '2.7.1'/ruby '2.7.8'/" Gemfile
sed -i "s/gem 'rails', '~> 6.0.3'/gem 'rails', '~> 6.0.6'/" Gemfile
grep -q concurrent-ruby Gemfile || printf "\ngem 'concurrent-ruby', '< 1.3.5'\n" >> Gemfile
grep -q rspec-rails Gemfile || printf "\ngroup :test do\n  gem 'rspec-rails', '~> 5.1'\nend\n" >> Gemfile
sed -i "s/- localhost:27017/- <%= ENV.fetch('MONGO_HOST', 'localhost') %>:27017/" config/mongoid.yml
# drop the yanked gem (and its only dependant, marcel 0.3.3) from the lock so bundler re-resolves them
if grep -q '^    mimemagic (' Gemfile.lock; then
  sed -i -e '/^    mimemagic (/d' -e '/^    marcel (/,/^      mimemagic/d' -e '/^      marcel (/d' Gemfile.lock
fi
bundle update rails nokogiri concurrent-ruby
bundle lock --add-platform x86_64-linux
bundle install
