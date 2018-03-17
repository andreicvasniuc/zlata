require 'active_support/concern'

module SlideConcern
  extend ActiveSupport::Concern

  included do
    field :title, type: String, localize: true
    field :link_text, type: String, localize: true
    field :link_url, type: String
    field :published, type: Boolean

    slug :title

    default_scope -> { order(:updated_at => :desc) }

    def as_json(options={})
      attrs = super(options)

      attrs["slug"] = self.slug;
      attrs["slider_slug"] = self.slider && self.slider.slug;
      
      attrs
    end
  end
end