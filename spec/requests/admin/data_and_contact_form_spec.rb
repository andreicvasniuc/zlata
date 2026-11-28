require 'rails_helper'

RSpec.describe 'Admin data export/import and the contact form', type: :request do
  describe 'POST /admin/data/export' do
    it 'exports every entity with $oid ids' do
      collection = create_collection('Spring')
      create_product(collection, 'Rose')
      Admin::Size.create!(name: 'M')
      Admin::Color.create!(name: 'Ivory')
      Admin::ContactGroup.create!(name: 'Sales').contacts.create!(name: 'Anna')
      Admin::Slider.create!(name: 'Home').slides.create!(title: 'Hello')
      Admin::SocialNetworking.create!(name: 'Instagram')

      api_post '/admin/data/export', {}, headers: auth_headers

      expect(response).to have_http_status(:ok)
      data = json['data']
      expect(data.keys).to contain_exactly('collections', 'colors', 'contactGroups', 'sizes', 'sliders', 'socialNetworkings')
      expect(data['collections'].first['_id']).to match('$oid' => /\A\h{24}\z/)
      expect(data['collections'].first['products'].first['name']).to eq('Rose')
      expect(data['contactGroups'].first['contacts'].first['name']).to eq('Anna')
      expect(data['sliders'].first['slides'].first['title']).to eq('Hello')
    end
  end

  describe 'POST /:locale/admin/data/import' do
    def stub_import_file(locale, payload)
      path = "#{Rails.root}/public/data/#{locale}.json"
      allow(File).to receive(:exist?).and_call_original
      allow(File).to receive(:exist?).with(path).and_return(true)
      allow(File).to receive(:read).and_call_original
      allow(File).to receive(:read).with(path).and_return(payload.to_json)
    end

    it 'restores an export into an empty database, keeping ids' do
      collection = create_collection('Spring', has_accessories: false)
      product = create_product(collection, 'Rose', is_top: true, price: 1200, currency: 'EUR')
      create_image(product, 'https://img.example.test/1.jpg', is_cover: true)
      collection.create_image(url: 'https://img.example.test/c.jpg')
      Admin::Size.create!(name: 'M')
      Admin::Color.create!(name: 'Ivory')
      group = Admin::ContactGroup.create!(name: 'Sales', css_class: 'sales', published: true)
      group.contacts.create!(name: 'Anna', published: true)
      slider = Admin::Slider.create!(name: 'Home', autoplay: true, published: true)
      slide = slider.slides.create!(title: 'Hello', link_url: '/a', published: true)
      slide.create_image(url: 'https://img.example.test/s.jpg')
      Admin::SocialNetworking.create!(name: 'Instagram', url: 'https://i.example.test', css_class: 'ig', published: true)

      headers = auth_headers
      api_post '/admin/data/export', {}, headers: headers
      exported = json
      ids = { collection: collection.id, product: product.id, group: group.id, slider: slider.id }

      Mongoid.purge!
      stub_import_file('en', exported)
      api_post '/en/admin/data/import', {}, headers: auth_headers

      expect(response).to have_http_status(:ok)
      expect(json).to eq('message' => 'Import has been done successfully!')
      restored = Admin::Collection.find(ids[:collection])
      expect(restored.name).to eq('Spring')
      expect(restored.image.url).to eq('https://img.example.test/c.jpg')
      expect(restored.products.find(ids[:product]).images.first.url).to eq('https://img.example.test/1.jpg')
      expect(restored.products.find(ids[:product])).to have_attributes(price: 1200, currency: 'EUR')
      expect(Admin::Size.first.name).to eq('M')
      expect(Admin::Color.first.name).to eq('Ivory')
      expect(Admin::ContactGroup.find(ids[:group]).contacts.first.name).to eq('Anna')
      expect(Admin::Slider.find(ids[:slider]).slides.first.image.url).to eq('https://img.example.test/s.jpg')
      expect(Admin::SocialNetworking.first.name).to eq('Instagram')
    end

    it 'imports a locale file into that locale only' do
      create_collection('Spring')
      headers = auth_headers
      api_post '/admin/data/export', {}, headers: headers
      stub_import_file('ua', { data: { collections: [json['data']['collections'].first.merge('name' => 'Spring UA')] } })

      api_post '/ua/admin/data/import', {}, headers: headers

      expect(response).to have_http_status(:ok)
      names = Admin::Collection.first.name_translations.transform_keys(&:to_s)
      expect(names).to include('en' => 'Spring', 'ua' => 'Spring UA')
    end

    it 'reports a missing import file' do
      path = "#{Rails.root}/public/data/ro.json"
      allow(File).to receive(:exist?).and_call_original
      allow(File).to receive(:exist?).with(path).and_return(false)

      api_post '/ro/admin/data/import', {}, headers: auth_headers

      expect(response).to have_http_status(:ok)
      expect(json['message']).to eq("Import file #{path} doesn't exist")
    end

    it 'reports an import file without data' do
      stub_import_file('en', {})

      api_post '/en/admin/data/import', {}, headers: auth_headers

      expect(json).to eq('message' => 'Data is missing')
    end
  end

  describe 'POST /api/contacts/send_form' do
    let(:contact) { { name: 'Anna', email: 'anna@example.test', phone: '+380 00 000 00 00', message: 'Hello <b>there</b>' } }

    before { stub_const('ENV', ENV.to_hash.merge('to_email' => 'office@example.test')) }

    it 'sends the form by email and echoes it back' do
      api_post '/api/contacts/send_form', { contact: contact }

      expect(response).to have_http_status(:ok)
      expect(json['contact']).to eq(contact.stringify_keys)
      expect(ActionMailer::Base.deliveries.size).to eq(1)
      mail = ActionMailer::Base.deliveries.last
      expect(mail.to).to eq(['office@example.test'])
      expect(mail.subject).to include('anna@example.test')
      body = mail.body.to_s
      expect(body).to include('Anna', 'anna@example.test', '+380 00 000 00 00')
      expect(body).to include('Hello &lt;b&gt;there&lt;/b&gt;') # user input is HTML-escaped
    end

    it 'ignores unpermitted fields' do
      api_post '/api/contacts/send_form', { contact: contact.merge(admin: true) }

      expect(json['contact'].keys).to contain_exactly('name', 'email', 'phone', 'message')
    end
  end
end
