require 'active_support/concern'

module SliderConcern
  extend ActiveSupport::Concern

  included do
    store_in collection: 'sliders'

    field :name, type: String, localize: true
    field :autoplay, type: Mongoid::Boolean
    field :published, type: Mongoid::Boolean

    index name: 1
    index published: 1

    slug :name

    attr_accessor :slides_count

    def as_json(options={})
      attrs = super(options)

      # a query projection (`only`) can leave out the embedded slides, which Mongoid 9 refuses to read
      slides_loaded = has_attribute?("slides")
      attrs["slides_count"] = self.slides_count || (slides_loaded ? self.slides.count : 0)
      attrs["slug"] = self.slug;

        self.slides.each_with_index do |slide, index|
          attrs["slides"][index] = slide.as_json(attrs["slides"][index])
        end if slides_loaded && self.slides.present?
      
      attrs
    end

  end
end