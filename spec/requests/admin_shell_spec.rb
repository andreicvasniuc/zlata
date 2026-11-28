require 'rails_helper'

RSpec.describe 'Admin shell', type: :request do
  %w[/admin /admin/login /admin/collections /admin/collection/some-slug/products].each do |path|
    it "serves the SPA shell at #{path}" do
      get path

      expect(response).to have_http_status(:ok)
      expect(response.body).to include('<div id="app"></div>', '<meta name="app-base" content="/admin/">')
      expect(response.body).to match(%r{/build/assets/admin-\w+[\w-]*\.js})
    end
  end

  it 'serves hashed build files with long cache headers' do
    file = Dir[Rails.public_path.join('build/assets/*.css')].first
    get "/build/assets/#{File.basename(file)}"

    expect(response).to have_http_status(:ok)
    expect(response.headers['cache-control']).to include('immutable')
  end
end
