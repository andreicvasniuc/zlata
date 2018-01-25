require 'active_support/concern'

module SocialNetworkingConcern
  extend ActiveSupport::Concern

  included do
    store_in collection: 'social_networkings'

    field :name, type: String, localize: true
    field :published, type: Boolean

    index name: 1
    index published: 1

    slug :name

    def as_json(options={})
      attrs = super(options)
      attrs["slug"] = self.slug;
      attrs
    end

  end
end