module Authenticable
  extend ActiveSupport::Concern

  private
    def authenticate_user
      head :unauthorized unless current_user
    end

    def current_user
      return @current_user if defined?(@current_user)

      @current_user = AuthToken.user_for(bearer_token)
    end

    def bearer_token
      request.authorization.to_s[/\ABearer\s+(\S+)\z/i, 1]
    end
end
