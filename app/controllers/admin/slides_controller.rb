class Admin::SlidesController < SecuredController
  before_action :set_slider
  before_action :set_slide, only: [:show, :update, :destroy, :upload_image]

  # GET /admin/sliders/:slider_id/slides/1
  # GET /admin/sliders/:slider_id/slides/1.json
  def show
    render json: @slide
  end

  # POST /admin/sliders/:slider_id/slides
  # POST /admin/sliders/:slider_id/slides.json
  def create
    @slide = @slider.slides.build(slide_params)

    if @slide.save
      render json: @slide, status: :created
    else
      render json: @slide.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /admin/sliders/:slider_id/slides/1
  # PATCH/PUT /admin/sliders/:slider_id/slides/1.json
  def update
    if @slide.update(slide_params)
      render json: @slide, status: :ok
    else
      render json: @slide.errors, status: :unprocessable_entity
    end
  end

  # DELETE /admin/sliders/:slider_id/slides/1
  # DELETE /admin/sliders/:slider_id/slides/1.json
  def destroy
    @slide.destroy

    render json: @slide, status: :ok
  end

  # POST /admin/sliders/:slider_id/upload_image
  # POST /admin/sliders/:slider_id/upload_image.json
  def upload_image
    delete_image() unless @slide.image.nil?

    @image = @slide.build_image(slide_image_params)

    if @image.save
      render json: @slide, status: :ok#, location: @collection
    else
      render json: @image.errors, status: :unprocessable_entity
    end
  end
  
  private

    def delete_image
      @slide.image.destroy
    end

    def set_slider
      @slider = Admin::Slider.find(params[:slider_id])
    end

    def set_slide
      @slide = @slider.slides.find(params[:id])
    end

    def slide_params
      params.require(:slide).permit(:title, :link_text, :link_url, :published)
    end

    def slide_image_params
      params.require(:image).permit(:url)
    end
end
