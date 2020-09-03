class ContactGroup
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
  include ContactGroupConcern

  embeds_many :contacts, class_name: "Contact"

  scope :published, -> { where( published: true ) }
  scope :latest, -> { order( created_at: :desc ) }

  def self.published_contact_groups
    self.published.latest
  end
end
