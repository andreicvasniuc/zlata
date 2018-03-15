class Admin::SlidersController < SecuredController
  before_action :set_slider, only: [:show, :update, :destroy]

  # POST /admin/sliders/search
  # POST /admin/sliders/search.json
  def search
    @sliders, @total_count = Admin::Slider.search(params[:search], params[:pagination], params[:sorting])

    render json: { sliders: @sliders, totalCount: @total_count }
  end

  # GET /admin/sliders/list
  # GET /admin/sliders/list.json
  def list
    @sliders = Admin::Slider.names

    render json: { sliders: @sliders }
  end

  # GET /admin/sliders/1
  # GET /admin/sliders/1.json
  def show
    render json: @slider
  end

  # POST /admin/sliders
  # POST /admin/sliders.json
  def create
    @slider = Admin::Slider.new(slider_params)

    if @slider.save
      render json: @slider, status: :created
    else
      render json: @slider.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /admin/sliders/1
  # PATCH/PUT /admin/sliders/1.json
  def update
    if @slider.update(slider_params)
      render json: @slider, status: :ok
    else
      render json: @slider.errors, status: :unprocessable_entity
    end
  end

  # DELETE /admin/sliders/1
  # DELETE /admin/sliders/1.json
  def destroy
    @slider.destroy

    render json: @slider, status: :ok
  end
  
  private

    def set_slider
      @slider = Admin::Slider.find(slider_id)
    end

    def slider_id
      params[:id]
    end

    def slider_params
      params.require(:slider).permit(:name, :published)
    end
end
