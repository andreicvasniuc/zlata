require 'rails_helper'

# Sizes, colors, social networkings: flat resources
RSpec.describe 'Admin sizes, colors and social networkings', type: :request do
  let(:headers) { auth_headers }
  let(:locales) { %w[en ua ru ro] }

  %w[size color].each do |kind|
    describe "#{kind}s" do
      let(:model) { "Admin::#{kind.capitalize}".constantize }

      it "POST creates a #{kind} with its name in every locale" do
        api_post "/admin/#{kind}s", { kind => { name: 'Ivory' } }, headers: headers

        expect(response).to have_http_status(:created)
        expect(json).to include('name' => 'Ivory')
        expect(json['_id']).to match('$oid' => /\A\h{24}\z/)
        expect(model.find(oid(json)).name_translations.transform_keys(&:to_s)).to eq(locales.to_h { |l| [l, 'Ivory'] })
      end

      it "GET list returns every #{kind} sorted by name" do
        %w[M S L].each { |name| model.create!(name: name) }

        api_get "/admin/#{kind}s/list", headers: headers

        expect(response).to have_http_status(:ok)
        expect(json["#{kind}s"].map { |item| item['name'] }).to eq(%w[L M S])
      end

      it "PATCH updates the #{kind} for one locale" do
        record = model.create!(name: 'Ivory')

        api_patch "/ru/admin/#{kind}s/#{record.id}", { kind => { name: 'Слоновая кость' } }, headers: headers

        expect(response).to have_http_status(:ok)
        expect(json['name']).to eq('Слоновая кость')
        expect(model.find(record.id).name_translations.transform_keys(&:to_s)).to include('en' => 'Ivory', 'ru' => 'Слоновая кость')
      end

      it "DELETE removes the #{kind}" do
        record = model.create!(name: 'Ivory')

        api_delete "/admin/#{kind}s/#{record.id}", headers: headers

        expect(response).to have_http_status(:ok)
        expect(model.count).to eq(0)
      end
    end
  end

  describe 'social networkings' do
    let!(:instagram) { Admin::SocialNetworking.create!(name: 'Instagram', url: 'https://i.example.test', css_class: 'ig', published: true) }

    it 'POST creates one' do
      api_post '/admin/social_networkings', { social_networking: { name: 'Facebook', url: 'https://f.example.test', css_class: 'fb', published: false } }, headers: headers

      expect(response).to have_http_status(:created)
      expect(json).to include('name' => 'Facebook', 'url' => 'https://f.example.test', 'css_class' => 'fb', 'published' => false, 'slug' => 'facebook')
    end

    it 'GET shows by slug' do
      api_get '/admin/social_networkings/instagram', headers: headers

      expect(response).to have_http_status(:ok)
      expect(json).to include('name' => 'Instagram', 'css_class' => 'ig')
    end

    it 'POST search filters by name and counts all records' do
      Admin::SocialNetworking.create!(name: 'Facebook', url: 'https://f.example.test')

      api_post '/admin/social_networkings/search', search_body(search: 'Insta', sorting: { field: 'name.en', direction: 'asc' }), headers: headers

      expect(response).to have_http_status(:ok)
      expect(json['socialNetworkings'].map { |n| n['name'] }).to eq(['Instagram'])
      expect(json['totalCount']).to eq(2)
    end

    it 'PATCH updates' do
      api_patch '/admin/social_networkings/instagram', { social_networking: { url: 'https://new.example.test' } }, headers: headers

      expect(response).to have_http_status(:ok)
      expect(Admin::SocialNetworking.find(instagram.id).url).to eq('https://new.example.test')
    end

    it 'DELETE removes' do
      api_delete '/admin/social_networkings/instagram', headers: headers

      expect(response).to have_http_status(:ok)
      expect(Admin::SocialNetworking.count).to eq(0)
    end
  end
end
