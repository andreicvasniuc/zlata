require 'rails_helper'

RSpec.describe 'Admin contact groups and sliders', type: :request do
  let(:headers) { auth_headers }

  describe 'contact groups' do
    let!(:group) { Admin::ContactGroup.create!(name: 'Sales', css_class: 'sales', published: true) }

    it 'POST creates a group' do
      api_post '/admin/contact_groups', { contact_group: { name: 'Press', css_class: 'press', published: false } }, headers: headers

      expect(response).to have_http_status(:created)
      expect(json).to include('name' => 'Press', 'css_class' => 'press', 'published' => false, 'slug' => 'press', 'contacts_count' => 0)
    end

    it 'GET list returns names and slugs; GET show returns the group with its contacts' do
      group.contacts.create!(name: '+380 00 000 00 00', published: true)

      api_get '/admin/contact_groups/list', headers: headers
      expect(json['contactGroups'].map { |g| g['name'] }).to eq(['Sales'])

      api_get '/admin/contact_groups/sales', headers: headers
      expect(json['contacts'].map { |c| c['name'] }).to eq(['+380 00 000 00 00'])
      expect(json['contacts_count']).to eq(1)
    end

    it 'POST search filters by name and counts contacts' do
      group.contacts.create!(name: 'a')
      Admin::ContactGroup.create!(name: 'Press')

      api_post '/admin/contact_groups/search', search_body(search: 'Sal', sorting: { field: 'name', direction: 'asc' }), headers: headers

      expect(response).to have_http_status(:ok)
      expect(json['contactGroups'].map { |g| [g['name'], g['contacts_count']] }).to eq([['Sales', 1]])
      expect(json['totalCount']).to eq(2)
    end

    it 'PATCH updates and DELETE removes' do
      api_patch '/admin/contact_groups/sales', { contact_group: { published: false } }, headers: headers
      expect(response).to have_http_status(:ok)
      expect(Admin::ContactGroup.find(group.id).published).to eq(false)

      api_delete '/admin/contact_groups/sales', headers: headers
      expect(response).to have_http_status(:ok)
      expect(Admin::ContactGroup.count).to eq(0)
    end

    describe 'contacts' do
      it 'POST creates a contact inside the group' do
        api_post '/admin/contact_groups/sales/contacts', { contact: { name: '+380 11 111 11 11', published: true } }, headers: headers

        expect(response).to have_http_status(:created)
        expect(json).to include('name' => '+380 11 111 11 11', 'contact_group_slug' => 'sales')
        expect(Admin::ContactGroup.find(group.id).contacts.count).to eq(1)
      end

      it 'GET, PATCH and DELETE work by slug' do
        group.contacts.create!(name: 'Anna', published: true)

        api_get '/admin/contact_groups/sales/contacts/anna', headers: headers
        expect(json).to include('name' => 'Anna', 'contact_group_slug' => 'sales')

        api_patch '/admin/contact_groups/sales/contacts/anna', { contact: { name: 'Anna K', published: false } }, headers: headers
        expect(response).to have_http_status(:ok)
        expect(json).to include('name' => 'Anna K', 'published' => false)

        api_delete '/admin/contact_groups/sales/contacts/anna-k', headers: headers
        expect(response).to have_http_status(:ok)
        expect(Admin::ContactGroup.find(group.id).contacts.count).to eq(0)
      end
    end
  end

  describe 'sliders' do
    let!(:slider) { Admin::Slider.create!(name: 'Home', autoplay: true, published: true) }

    it 'POST creates a slider with its name in every locale' do
      api_post '/admin/sliders', { slider: { name: 'Promo', autoplay: false, published: false } }, headers: headers

      expect(response).to have_http_status(:created)
      expect(json).to include('name' => 'Promo', 'autoplay' => false, 'published' => false, 'slug' => 'promo', 'slides_count' => 0)
      names = Admin::Slider.find(oid(json)).name_translations.transform_keys(&:to_s)
      expect(names).to eq(%w[en ua ru ro].to_h { |l| [l, 'Promo'] })
    end

    it 'GET list, show, search' do
      slider.slides.create!(title: 'Hello', published: true)

      api_get '/admin/sliders/list', headers: headers
      expect(json['sliders'].map { |s| s['name'] }).to eq(['Home'])

      api_get '/admin/sliders/home', headers: headers
      expect(json['slides'].map { |s| s['title'] }).to eq(['Hello'])

      api_post '/admin/sliders/search', search_body(search: 'Ho', sorting: { field: 'name.en', direction: 'asc' }), headers: headers
      expect(json['sliders'].map { |s| [s['name'], s['slides_count']] }).to eq([['Home', 1]])
      expect(json['totalCount']).to eq(1)
    end

    it 'PATCH updates and DELETE removes' do
      api_patch '/admin/sliders/home', { slider: { autoplay: false } }, headers: headers
      expect(response).to have_http_status(:ok)
      expect(Admin::Slider.find(slider.id).autoplay).to eq(false)

      api_delete '/admin/sliders/home', headers: headers
      expect(response).to have_http_status(:ok)
      expect(Admin::Slider.count).to eq(0)
    end

    describe 'slides' do
      it 'POST creates a slide with title and link text in every locale' do
        api_post '/admin/sliders/home/slides', { slide: { title: 'Hello', link_text: 'More', link_url: '/more', published: true } }, headers: headers

        expect(response).to have_http_status(:created)
        expect(json).to include('title' => 'Hello', 'link_text' => 'More', 'link_url' => '/more', 'slider_slug' => 'home', 'slug' => 'hello')
        record = Admin::Slider.find(slider.id).slides.first
        expect(record.title_translations.transform_keys(&:to_s)).to eq(%w[en ua ru ro].to_h { |l| [l, 'Hello'] })
        expect(record.link_text_translations.transform_keys(&:to_s)).to eq(%w[en ua ru ro].to_h { |l| [l, 'More'] })
      end

      it 'GET, PATCH and DELETE work by slug' do
        slider.slides.create!(title: 'Hello', link_url: '/a', published: true)

        api_get '/admin/sliders/home/slides/hello', headers: headers
        expect(json).to include('title' => 'Hello', 'slider_slug' => 'home')

        api_patch '/ua/admin/sliders/home/slides/hello', { slide: { title: 'Привіт', published: false } }, headers: headers
        expect(response).to have_http_status(:ok)
        expect(json).to include('title' => 'Привіт', 'published' => false)

        api_delete '/admin/sliders/home/slides/privit', headers: headers
        expect(response).to have_http_status(:ok)
        expect(Admin::Slider.find(slider.id).slides.count).to eq(0)
      end

      it 'POST upload_image sets the image and replaces the previous one' do
        slider.slides.create!(title: 'Hello')

        api_post '/admin/sliders/home/slides/hello/upload_image', { image: { url: 'https://img.example.test/1.jpg' } }, headers: headers
        expect(response).to have_http_status(:ok)
        expect(json['image']['url']).to eq('https://img.example.test/1.jpg')

        api_post '/admin/sliders/home/slides/hello/upload_image', { image: { url: 'https://img.example.test/2.jpg' } }, headers: headers
        expect(json['image']['url']).to eq('https://img.example.test/2.jpg')
        expect(Admin::Slider.find(slider.id).slides.first.image.url).to eq('https://img.example.test/2.jpg')
      end
    end
  end
end
