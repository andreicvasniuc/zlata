require 'active_support/concern'

module ContactConcern
  extend ActiveSupport::Concern

  included do
    field :name, type: String
    field :published, type: Boolean

    slug :name

    default_scope -> { order(:updated_at => :desc) }

    def as_json(options={})
      attrs = super(options)

      attrs["slug"] = self.slug;
      attrs["contact_group_slug"] = self.contact_group && self.contact_group.slug;
      
      attrs
    end
  end
end