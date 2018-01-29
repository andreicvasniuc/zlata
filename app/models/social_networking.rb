class SocialNetworking
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
  include SocialNetworkingConcern

  scope :published, -> { where( published: true ) }
  scope :latest, -> { order( created_at: :desc ) }
  scope :base_info, -> { only( :name, :url, :css_class, :_slugs ) }

  def self.published_social_networkings
    self.published.latest.base_info
  end
end
