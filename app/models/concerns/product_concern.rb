require 'active_support/concern'

module ProductConcern
  extend ActiveSupport::Concern

  included do
    field :name, type: String, localize: true
    field :description, type: String, localize: true
    field :published, type: Boolean
    field :is_top, type: Boolean
    field :size_ids, type: Array
    field :color_ids, type: Array

    slug :name

    default_scope -> { order(:updated_at => :desc) }

    def as_json(options={})
      attrs = super(options)

      attrs["slug"] = self.slug;
      attrs["collection_slug"] = self.product_collection && self.product_collection.slug;

      self.images.each_with_index do |image, index|
        attrs["cover_image"] = attrs["images"][index] if image.is_cover
      end
      
      attrs
    end
  end
end