require 'active_support/concern'

module ContactGroupConcern
  extend ActiveSupport::Concern

  included do
    store_in collection: 'contact_groups'

    field :name, type: String
    field :css_class, type: String
    field :published, type: Mongoid::Boolean

    index name: 1
    index published: 1

    slug :name

    attr_accessor :contacts_count

    def as_json(options={})
      attrs = super(options)

      # a query projection (`only`) can leave out the embedded contacts, which Mongoid 9 refuses to read
      contacts_loaded = has_attribute?("contacts")
      attrs["contacts_count"] = self.contacts_count || (contacts_loaded ? self.contacts.count : 0)
      attrs["slug"] = self.slug;

        self.contacts.each_with_index do |contact, index|
          attrs["contacts"][index] = contact.as_json(attrs["contacts"][index])
        end if contacts_loaded && self.contacts.present?
      
      attrs
    end

  end
end