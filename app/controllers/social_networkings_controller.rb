class SocialNetworkingsController < ApplicationController
  # GET /api/social_networkings/list
  # GET /api/social_networkings/list.json
  def list
    render json: { social_networkings: SocialNetworking.published_social_networkings }
  end
end
