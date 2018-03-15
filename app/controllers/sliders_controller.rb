class SlidersController < ApplicationController
  # GET /api/sliders/published
  # GET /api/sliders/published.json
  def published
    render json: { slider: Slider.first_published }
  end
end
