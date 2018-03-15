class Slide
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
  include SlideConcern

  embedded_in :slider, class_name: "Slider"
end
