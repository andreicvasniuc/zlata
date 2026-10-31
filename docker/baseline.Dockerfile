# Reference build of the ORIGINAL app (Ruby 2.7.8 / Rails 6.0.6.1), used only to
# produce the API snapshots that the upgraded app must match. Not for deployment.
FROM ruby:2.7.8-slim

# Debian 11 is EOL and gone from the regular mirrors; use the archive.
RUN rm -f /etc/apt/sources.list.d/* \
 && printf 'deb http://archive.debian.org/debian bullseye main\ndeb http://archive.debian.org/debian-security bullseye-security main\n' > /etc/apt/sources.list \
 && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99archive \
 && apt-get update \
 && apt-get install -y --no-install-recommends build-essential git libyaml-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
