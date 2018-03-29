class Slider
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
  include SliderConcern

  embeds_many :slides, class_name: "Slide"

  scope :published, -> { where(published: true) }
  scope :latest, -> { order( created_at: :desc ) }
  scope :main_info, -> { only( :name, :_slugs, :slides ) }

  def self.first_published
    self.published.main_info.first
  end
end
