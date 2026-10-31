class UserTokenController < ApplicationController
  rescue_from Exceptions::UserNotFound, with: :not_found

  # POST /user_token
  # body: { auth: { email:, password: } }
  def create
    # an unknown email raises Mongoid::Errors::DocumentNotFound, which Rails answers with 404 as well
    user = User.find_by(email: auth_params[:email])
    raise Exceptions::UserNotFound unless user.authenticate(auth_params[:password])

    render json: { jwt: AuthToken.issue(user) }, status: :created
  end

  private
    def auth_params
      params.require(:auth).permit(:email, :password)
    end

    def not_found
      head :not_found
    end
end
