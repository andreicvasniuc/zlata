class Admin::SocialNetworkingsController < SecuredController
  before_action :set_social_networking, only: [:show, :update, :destroy]

  # POST /admin/social_networkings/search
  # POST /admin/social_networkings/search.json
  def search
    @social_networkings, @total_count = Admin::SocialNetworking.search(params[:search], params[:pagination], params[:sorting])

    render json: { socialNetworkings: @social_networkings, totalCount: @total_count }
  end

  # GET /admin/social_networkings/1
  # GET /admin/social_networkings/1.json
  def show
    render json: @social_networking
  end

  # POST /admin/social_networkings
  # POST /admin/social_networkings.json
  def create
    @social_networking = Admin::SocialNetworking.new(social_networking_params)

    if @social_networking.save
      render json: @social_networking, status: :created
    else
      render json: @social_networking.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /admin/social_networkings/1
  # PATCH/PUT /admin/social_networkings/1.json
  def update
    if @social_networking.update(social_networking_params)
      render json: @social_networking, status: :ok
    else
      render json: @social_networking.errors, status: :unprocessable_entity
    end
  end

  # DELETE /admin/social_networkings/1
  # DELETE /admin/social_networkings/1.json
  def destroy
    @social_networking.destroy

    render json: @social_networking, status: :ok
  end
  
  private

    def set_social_networking
      @social_networking = Admin::SocialNetworking.find(social_networking_id)
    end

    def social_networking_id
      params[:id]
    end

    def social_networking_params
      params.require(:social_networking).permit(:name, :url, :css_class, :published)
    end
end
