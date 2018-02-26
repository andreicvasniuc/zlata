require 'active_support/concern'

module ContactGroupConcern
  extend ActiveSupport::Concern

  included do
    store_in collection: 'contact_groups'

    field :name, type: String
    field :css_class, type: String
    field :published, type: Boolean

    index name: 1
    index published: 1

    slug :name

    attr_accessor :contacts_count

    def as_json(options={})
      attrs = super(options)

      attrs["contacts_count"] = self.contacts_count || (self.contacts || []).count
      attrs["slug"] = self.slug;

        self.contacts.each_with_index do |contact, index|
          attrs["contacts"][index] = contact.as_json(attrs["contacts"][index])
        end if self.contacts.present?
      
      attrs
    end

  end
end