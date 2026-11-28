class HomeController < ApplicationController
  # The public SPA shell with per-page meta tags; unknown collections/products answer 404
  # (the SPA shows its not-found page).
  def index
    @app_base = "/"
    @meta = PageMeta.new(request.path, base_url: request.base_url).call
    render :index, status: @meta.status
  end

  # The admin SPA shell.
  def admin
  end
end
