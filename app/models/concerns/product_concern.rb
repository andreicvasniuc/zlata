require 'active_support/concern'

module ProductConcern
  extend ActiveSupport::Concern

  CURRENCIES = %w[EUR USD UAH].freeze

  included do
    field :name, type: String, localize: true
    field :description, type: String, localize: true
    field :published, type: Mongoid::Boolean
    field :is_top, type: Mongoid::Boolean
    field :size_ids, type: Array
    field :color_ids, type: Array
    # "from" price, the same in every locale; the currency is required when there is a price
    field :price, type: Integer
    field :currency, type: String

    slug :name

    # the check runs on the raw value, because Mongoid casts "abc" to nil and 1.5 to 1
    validates :price, numericality: { only_integer: true, greater_than: 0 }, if: :price_given?
    validates :currency, inclusion: { in: CURRENCIES }, if: -> { price.present? }

    default_scope -> { order(:updated_at => :desc) }

    def price_given?
      raw = price_before_type_cast
      !(raw.nil? || raw == "")
    end

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