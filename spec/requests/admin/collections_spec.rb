require 'rails_helper'

RSpec.describe 'Admin collections, products and images', type: :request do
  let(:headers) { auth_headers }
  let(:locales) { %w[en ua ru ro] }

  def translations(record, field)
    record.public_send("#{field}_translations").transform_keys(&:to_s)
  end

  describe 'collections' do
    it 'POST /admin/collections creates a collection with its name in every locale' do
      api_post '/admin/collections', { collection: { name: 'Spring', description: 'Light', published: true, has_accessories: false } }, headers: headers

      expect(response).to have_http_status(:created)
      expect(json).to include('name' => 'Spring', 'description' => 'Light', 'published' => true, 'slug' => 'spring', 'products_count' => 0)
      expect(json['_id']).to match('$oid' => /\A\h{24}\z/)
      record = Admin::Collection.find(oid(json))
      expect(translations(record, :name)).to eq(locales.to_h { |l| [l, 'Spring'] })
      expect(translations(record, :description)).to eq(locales.to_h { |l| [l, 'Light'] })
    end

    it 'PATCH /:locale/admin/collections/:slug updates only that locale' do
      collection = create_collection('Spring')

      api_patch '/ua/admin/collections/spring', { collection: { name: 'Spring UA', published: false } }, headers: headers

      expect(response).to have_http_status(:ok)
      expect(json).to include('name' => 'Spring UA', 'published' => false)
      record = Admin::Collection.find(collection.id)
      expect(translations(record, :name)).to eq('en' => 'Spring', 'ua' => 'Spring UA', 'ru' => 'Spring', 'ro' => 'Spring')
    end

    it 'GET /admin/collections/:id shows by slug and by id, with products' do
      collection = create_collection('Spring')
      create_product(collection, 'Rose')

      api_get '/admin/collections/spring', headers: headers
      expect(response).to have_http_status(:ok)
      expect(json['products'].map { |p| p['name'] }).to eq(['Rose'])
      expect(json['products_count']).to eq(1)

      api_get "/admin/collections/#{collection.id}", headers: headers
      expect(oid(json)).to eq(collection.id.to_s)
    end

    it 'GET /admin/collections/list returns names and slugs only' do
      create_collection('Spring')

      api_get '/admin/collections/list', headers: headers

      expect(json['collections'].first.keys).to contain_exactly('_id', '_slugs', 'name', 'slug', 'products_count')
      expect(json['collections'].first).to include('name' => 'Spring', '_slugs' => ['spring'])
    end

    it 'POST /admin/collections/search filters, sorts, paginates and counts products' do
      spring = create_collection('Spring dresses')
      2.times { |i| create_product(spring, "Dress #{i}") }
      create_collection('Winter coats')
      create_collection('Spring accessories')

      api_post '/admin/collections/search', search_body(search: 'Spring', sorting: { field: 'name.en', direction: 'asc' }), headers: headers

      expect(response).to have_http_status(:ok)
      expect(json['collections'].map { |c| c['name'] }).to eq(['Spring accessories', 'Spring dresses'])
      expect(json['collections'].map { |c| c['products_count'] }).to eq([0, 2])
      expect(json['totalCount']).to eq(3)

      api_post '/admin/collections/search', search_body(pagination: { skip: 1, take: 1 }, sorting: { field: 'name.en', direction: 'asc' }), headers: headers
      expect(json['collections'].map { |c| c['name'] }).to eq(['Spring dresses'])
    end

    it 'DELETE /admin/collections/:id removes the collection and its products' do
      collection = create_collection('Spring')
      create_product(collection, 'Rose')

      api_delete '/admin/collections/spring', headers: headers

      expect(response).to have_http_status(:ok)
      expect(Admin::Collection.count).to eq(0)
    end

    it 'POST /admin/collections/:id/upload_image sets the image and replaces the previous one' do
      collection = create_collection('Spring')

      api_post '/admin/collections/spring/upload_image', { image: { url: 'https://img.example.test/1.jpg' } }, headers: headers
      expect(response).to have_http_status(:ok)
      expect(json['image']['url']).to eq('https://img.example.test/1.jpg')

      api_post '/admin/collections/spring/upload_image', { image: { url: 'https://img.example.test/2.jpg' } }, headers: headers
      expect(json['image']['url']).to eq('https://img.example.test/2.jpg')
      expect(Admin::Collection.find(collection.id).image.url).to eq('https://img.example.test/2.jpg')
    end
  end

  describe 'products' do
    let!(:collection) { create_collection('Spring') }

    it 'POST creates a product with its name in every locale and the size and color ids' do
      size = Admin::Size.create!(name: 'M')
      color = Admin::Color.create!(name: 'Ivory')

      api_post '/admin/collections/spring/products',
               { product: { name: 'Rose', description: 'Lace', published: true, is_top: true, size_ids: [size.id.to_s], color_ids: [color.id.to_s] } },
               headers: headers

      expect(response).to have_http_status(:created)
      expect(json).to include('name' => 'Rose', 'slug' => 'rose', 'collection_slug' => 'spring', 'is_top' => true)
      expect(json['size_ids']).to eq([size.id.to_s])
      expect(json['color_ids']).to eq([color.id.to_s])
      product = Admin::Collection.find(collection.id).products.first
      expect(translations(product, :name)).to eq(locales.to_h { |l| [l, 'Rose'] })
    end

    it 'GET shows a product by slug' do
      create_product(collection, 'Rose')

      api_get '/admin/collections/spring/products/rose', headers: headers

      expect(response).to have_http_status(:ok)
      expect(json).to include('name' => 'Rose', 'collection_slug' => 'spring')
    end

    it 'PATCH updates the product for one locale' do
      product = create_product(collection, 'Rose')

      api_patch '/ro/admin/collections/spring/products/rose', { product: { name: 'Trandafir', is_top: true } }, headers: headers

      expect(response).to have_http_status(:ok)
      expect(json).to include('name' => 'Trandafir', 'is_top' => true)
      record = Admin::Collection.find(collection.id).products.find(product.id)
      expect(translations(record, :name)).to include('en' => 'Rose', 'ro' => 'Trandafir')
    end

    it 'DELETE removes the product' do
      create_product(collection, 'Rose')

      api_delete '/admin/collections/spring/products/rose', headers: headers

      expect(response).to have_http_status(:ok)
      expect(Admin::Collection.find(collection.id).products.count).to eq(0)
    end

    it 'returns 404 for an unknown product' do
      api_get '/admin/collections/spring/products/nope', headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'product images' do
    let!(:collection) { create_collection('Spring') }
    let!(:product) { create_product(collection, 'Rose') }
    let(:base) { '/admin/collections/spring/products/rose/images' }

    it 'POST upload adds an image by URL and returns the product' do
      api_post "#{base}/upload", { image: { url: 'https://img.example.test/1.jpg' } }, headers: headers

      expect(response).to have_http_status(:ok)
      expect(json['images'].map { |i| i['url'] }).to eq(['https://img.example.test/1.jpg'])
      expect(json['images'].first['_id']).to match('$oid' => /\A\h{24}\z/)
    end

    it 'PATCH make_cover marks exactly one image as the cover' do
      first = create_image(product, 'https://img.example.test/1.jpg', is_cover: true)
      second = create_image(product, 'https://img.example.test/2.jpg')

      api_patch "#{base}/#{second.id}/make_cover", {}, headers: headers

      expect(response).to have_http_status(:ok)
      expect(json['cover_image']['url']).to eq('https://img.example.test/2.jpg')
      expect(json['images'].map { |i| i['is_cover'] }).to eq([false, true])

      api_patch "#{base}/#{first.id}/make_cover", {}, headers: headers
      expect(json['cover_image']['url']).to eq('https://img.example.test/1.jpg')
      expect(Admin::Collection.find(collection.id).products.first.images.select(&:is_cover).size).to eq(1)
    end

    it 'DELETE removes an image' do
      image = create_image(product)

      api_delete "#{base}/#{image.id}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(json['images']).to eq([])
      expect(Admin::Collection.find(collection.id).products.first.images.count).to eq(0)
    end
  end
end
