require Rails.root.join('lib', 'locale_looper').to_s

class Admin::Slide
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
  include SlideConcern

  embedded_in :slider, class_name: "Admin::Slider"
  embeds_one :image, class_name: "Admin::SlideImage"

  after_create :create_for_all_locales

  def create_for_all_locales
    saved_title = self.title
    saved_link_text = self.link_text
    
    LocaleLooper.run do
      self.title = saved_title
      self.link_text = saved_link_text
    end

    self.save
  end
end
