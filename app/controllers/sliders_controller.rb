class SlidersController < ApplicationController
  # GET /api/sliders/home
  # GET /api/sliders/home.json
  def home
    render json: { slider: Slider.first_published }
  end
end
