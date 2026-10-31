require 'rails_helper'

RSpec.describe 'Authentication', type: :request do
  let!(:user) { admin_user }

  describe 'POST /user_token' do
    it 'returns 201 and an HS256 JWT for valid credentials' do
      api_post '/user_token', { auth: { email: ApiHelpers::ADMIN_EMAIL, password: ApiHelpers::ADMIN_PASSWORD } }

      expect(response).to have_http_status(:created)
      payload, header = JWT.decode(json['jwt'], secret_key_base, true, algorithm: 'HS256')
      expect(header['alg']).to eq('HS256')
      sub = payload['sub']
      sub = sub['$oid'] if sub.is_a?(Hash) # the old Knock tokens carried {"$oid": id}; the new ones carry the id string
      expect(sub).to eq(user.id.to_s)
      expect(payload['exp']).to be_within(120).of(1.day.from_now.to_i)
    end

    # The old app answers 500 here: Exceptions::UserNotFound lives in lib/, which is no longer autoloaded.
    it 'returns 404 for a wrong password', :baseline_bug do
      api_post '/user_token', { auth: { email: ApiHelpers::ADMIN_EMAIL, password: 'wrong' } }

      expect(response).to have_http_status(:not_found)
    end

    it 'returns 404 for an unknown email' do
      api_post '/user_token', { auth: { email: 'nobody@example.test', password: 'wrong' } }

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'protected endpoints' do
    let(:path) { '/admin/colors/list' }

    it 'accept a valid Bearer token' do
      api_get path, headers: { 'Authorization' => "Bearer #{jwt_for(user)}" }

      expect(response).to have_http_status(:ok)
    end

    it 'return 401 without a token' do
      api_get path

      expect(response).to have_http_status(:unauthorized)
    end

    it 'return 401 for a malformed token' do
      api_get path, headers: { 'Authorization' => 'Bearer not-a-jwt' }

      expect(response).to have_http_status(:unauthorized)
    end

    it 'return 401 for an expired token' do
      api_get path, headers: { 'Authorization' => "Bearer #{jwt_for(user, exp: 1.minute.ago.to_i)}" }

      expect(response).to have_http_status(:unauthorized)
    end

    it 'return 401 for a token signed with another key' do
      token = JWT.encode({ sub: user.id.to_s, exp: 1.day.from_now.to_i }, 'another-secret', 'HS256')
      api_get path, headers: { 'Authorization' => "Bearer #{token}" }

      expect(response).to have_http_status(:unauthorized)
    end

    it 'protect every admin route' do
      [
        [:get, '/admin/collections/list'], [:post, '/admin/collections/search'], [:post, '/admin/collections'],
        [:get, '/admin/sizes/list'], [:get, '/admin/colors/list'], [:post, '/admin/social_networkings/search'],
        [:get, '/admin/contact_groups/list'], [:get, '/admin/sliders/list'],
        [:post, '/admin/data/export'], [:post, '/admin/data/import']
      ].each do |verb, route|
        send(verb, route, as: :json)
        expect(response).to have_http_status(:unauthorized), "#{verb.upcase} #{route} returned #{response.status}"
      end
    end
  end
end
