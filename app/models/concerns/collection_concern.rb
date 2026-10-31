require 'active_support/concern'

module CollectionConcern
  extend ActiveSupport::Concern

  included do
    store_in collection: 'collections'

    field :name, type: String, localize: true
    field :description, type: String, localize: true
    field :published, type: Mongoid::Boolean
    field :has_accessories, type: Mongoid::Boolean

    index name: 1
    index published: 1

    slug :name

    attr_accessor :products_count

    def as_json(options={})
      attrs = super(options)

      # a query projection (`only`) can leave out the embedded products, which Mongoid 9 refuses to read
      products_loaded = has_attribute?("products")
      attrs["products_count"] = self.products_count || (products_loaded ? self.products.count : 0)
      attrs["slug"] = self.slug;

        self.products.each_with_index do |product, index|
          attrs["products"][index] = product.as_json(attrs["products"][index])
        end if products_loaded && self.products.present?
      
      attrs
    end

  end
end