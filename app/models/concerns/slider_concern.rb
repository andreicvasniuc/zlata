require 'active_support/concern'

module SliderConcern
  extend ActiveSupport::Concern

  included do
    store_in collection: 'sliders'

    field :name, type: String, localize: true
    field :autoplay, type: Boolean
    field :published, type: Boolean

    index name: 1
    index published: 1

    slug :name

    attr_accessor :slides_count

    def as_json(options={})
      attrs = super(options)

      attrs["slides_count"] = self.slides_count || (self.slides || []).count
      attrs["slug"] = self.slug;

        self.slides.each_with_index do |slide, index|
          attrs["slides"][index] = slide.as_json(attrs["slides"][index])
        end if self.slides.present?
      
      attrs
    end

  end
end