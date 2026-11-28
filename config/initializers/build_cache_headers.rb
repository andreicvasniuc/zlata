# Files in public/build carry a content hash in their name, so browsers may keep them for a year.
# The HTML shells rendered by HomeController stay uncached (Rails' default for dynamic responses).
class BuildCacheHeaders
  IMMUTABLE = "public, max-age=31536000, immutable".freeze

  def initialize(app)
    @app = app
  end

  def call(env)
    status, headers, body = @app.call(env)
    headers["cache-control"] = IMMUTABLE if status == 200 && env["PATH_INFO"].start_with?("/build/assets/")
    [status, headers, body]
  end
end

Rails.application.config.middleware.insert_before ActionDispatch::Static, BuildCacheHeaders
