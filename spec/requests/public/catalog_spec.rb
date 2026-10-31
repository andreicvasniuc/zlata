require 'rails_helper'

RSpec.describe 'Public catalog API', type: :request do
  def names(key)
    json.fetch(key).map { |item| item['name'] }
  end

  describe 'GET /api/collections/dresses and /accessories' do
    before do
      travel_to(3.days.ago) { create_collection('Old dresses') }
      travel_to(1.day.ago)  { create_collection('New dresses', has_accessories: false) }
      create_collection('Bags', has_accessories: true)
      create_collection('Hidden', published: false)
    end

    it 'lists published dress collections, newest first' do
      api_get '/api/collections/dresses'

      expect(response).to have_http_status(:ok)
      expect(names('collections')).to eq(['New dresses', 'Old dresses'])
    end

    it 'lists published accessory collections' do
      api_get '/api/collections/accessories'

      expect(names('collections')).to eq(['Bags'])
    end

    it 'returns ids as {"$oid": ...}, plus slug and products_count' do
      api_get '/api/collections/dresses'

      item = json['collections'].first
      expect(item['_id']).to match('$oid' => /\A\h{24}\z/)
      expect(item['slug']).to eq('new-dresses')
      expect(item['_slugs']).to eq(['new-dresses'])
      expect(item).to have_key('products_count')
    end

    it 'serves every locale' do
      %w[en ua ru ro].each do |locale|
        api_get "/#{locale}/api/collections/dresses"
        expect(response).to have_http_status(:ok)
        expect(names('collections')).to eq(['New dresses', 'Old dresses'])
      end
    end
  end

  describe 'GET /api/collections/:id' do
    let!(:collection) { create_collection('Spring', has_accessories: false) }
    let!(:product) { create_product(collection, 'Rose') }
    let!(:cover) { create_image(product, 'https://img.example.test/cover.jpg', is_cover: true) }
    let!(:other) { create_image(product, 'https://img.example.test/other.jpg') }

    it 'finds a collection by slug, with products, images and the cover image' do
      api_get '/api/collections/spring'

      expect(response).to have_http_status(:ok)
      body = json['collection']
      expect(body['name']).to eq('Spring')
      expect(body['slug']).to eq('spring')
      expect(body['products_count']).to eq(1)
      item = body['products'].first
      expect(item['name']).to eq('Rose')
      expect(item['slug']).to eq('rose')
      expect(item['collection_slug']).to eq('spring')
      expect(item['images'].map { |i| i['url'] }).to eq(['https://img.example.test/cover.jpg', 'https://img.example.test/other.jpg'])
      expect(item['cover_image']['url']).to eq('https://img.example.test/cover.jpg')
      expect(item['cover_image']['_id']).to match('$oid' => /\A\h{24}\z/)
    end

    it 'finds a collection by id' do
      api_get "/api/collections/#{collection.id}"

      expect(response).to have_http_status(:ok)
      expect(oid(json['collection'])).to eq(collection.id.to_s)
    end

    it 'returns localized names for the requested locale; the slug follows the last edited name' do
      I18n.with_locale(:ua) { Admin::Collection.find(collection.id).update(name: 'Spring UA') }

      api_get '/ua/api/collections/spring-ua'
      expect(json['collection']).to include('name' => 'Spring UA', 'slug' => 'spring-ua', '_slugs' => ['spring-ua'])

      api_get '/en/api/collections/spring-ua'
      expect(json['collection']['name']).to eq('Spring')

      api_get '/en/api/collections/spring'
      expect(response).to have_http_status(:not_found)
    end

    it 'returns 404 for an unknown collection' do
      api_get '/api/collections/does-not-exist'

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'GET /api/products/top_list' do
    it 'lists published top products of published collections, most recently updated first' do
      visible = create_collection('Visible')
      hidden = create_collection('Hidden', published: false)
      travel_to(2.days.ago) { create_product(visible, 'Older top', is_top: true) }
      travel_to(1.day.ago)  { create_product(visible, 'Newer top', is_top: true) }
      create_product(visible, 'Not top', is_top: false)
      create_product(visible, 'Unpublished top', is_top: true, published: false)
      create_product(hidden, 'In hidden collection', is_top: true)

      api_get '/api/products/top_list'

      expect(response).to have_http_status(:ok)
      expect(names('products')).to eq(['Newer top', 'Older top'])
      expect(json['products'].first['collection_slug']).to eq('visible')
    end
  end

  describe 'lists' do
    it 'sizes and colors are sorted by name' do
      %w[M S L].each { |name| Admin::Size.create!(name: name) }
      %w[White Ivory].each { |name| Admin::Color.create!(name: name) }

      api_get '/api/sizes/list'
      expect(names('sizes')).to eq(%w[L M S])

      api_get '/api/colors/list'
      expect(names('colors')).to eq(%w[Ivory White])
      expect(json['colors'].first['_id']).to match('$oid' => /\A\h{24}\z/)
    end

    it 'social networkings: published only, newest first, base fields only' do
      travel_to(2.days.ago) { Admin::SocialNetworking.create!(name: 'Instagram', url: 'https://i.example.test', css_class: 'ig', published: true) }
      travel_to(1.day.ago)  { Admin::SocialNetworking.create!(name: 'Facebook', url: 'https://f.example.test', css_class: 'fb', published: true) }
      Admin::SocialNetworking.create!(name: 'Hidden', url: 'https://h.example.test', published: false)

      api_get '/api/social_networkings/list'

      expect(names('social_networkings')).to eq(%w[Facebook Instagram])
      expect(json['social_networkings'].first.keys).to contain_exactly('_id', '_slugs', 'name', 'url', 'css_class', 'slug')
    end

    it 'contact groups: published only, with their contacts' do
      group = Admin::ContactGroup.create!(name: 'Sales', css_class: 'sales', published: true)
      group.contacts.create!(name: '+380 00 000 00 00', published: true)
      Admin::ContactGroup.create!(name: 'Hidden', published: false)

      api_get '/api/contact_groups/list'

      expect(names('contact_groups')).to eq(['Sales'])
      expect(json['contact_groups'].first['contacts_count']).to eq(1)
      expect(json['contact_groups'].first['contacts'].first).to include('name' => '+380 00 000 00 00', 'contact_group_slug' => 'sales')
    end

    it 'home slider: the first published slider with its slides' do
      Admin::Slider.create!(name: 'Draft', published: false)
      slider = Admin::Slider.create!(name: 'Home', autoplay: true, published: true)
      slide = slider.slides.create!(title: 'Hello', link_text: 'More', link_url: '/more', published: true)
      slide.create_image(url: 'https://img.example.test/slide.jpg')

      api_get '/api/sliders/home'

      body = json['slider']
      expect(body).to include('name' => 'Home', 'autoplay' => true, 'slides_count' => 1, 'slug' => 'home')
      expect(body['slides'].first).to include('title' => 'Hello', 'slider_slug' => 'home', 'slug' => 'hello')
      expect(body['slides'].first['image']['url']).to eq('https://img.example.test/slide.jpg')
    end
  end
end
