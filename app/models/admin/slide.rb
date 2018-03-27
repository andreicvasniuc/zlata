class Admin::Slide
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
  include SlideConcern

  embedded_in :slider, class_name: "Admin::Slider"
  embeds_one :image, class_name: "Admin::SlideImage"
end
