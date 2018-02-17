class Admin::Contact
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
  include ContactConcern

  embedded_in :contact_group, class_name: "Admin::ContactGroup"
end
