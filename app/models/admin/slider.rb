class Admin::Slider
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
  include SliderConcern

  embeds_many :slides, class_name: "Admin::Slide"

  scope :names, -> { only(:name, :_slugs) }

  after_create :create_for_all_locales

  def self.search(search, pagination, sorting)
    directions = { asc: 1, desc: -1 }
    
    list_json = collection
    .aggregate([
      { '$match' => {
          '$or' => [
            {"name.#{I18n.locale}" => {'$regex' => search}}
          ]
        }
      },
      { '$project' => {
          "name.#{I18n.locale}" => 1, 
          :_slugs => 1,
          :autoplay => 1, 
          :published => 1, 
          :updated_at => 1,
          :slides_count => { '$size' => { '$ifNull' => ['$slides', []] } }
        }
      },
      { '$sort' => {
          sorting[:field] => directions[sorting[:direction].to_sym]
        }
      },
      {
        '$skip' => pagination[:skip]
      },
      {
        '$limit' => pagination[:take]
      }])

    list_json = list_json.map do |item_json| 
      item_json["name"] = item_json["name"][I18n.locale]
      self.new(item_json)
    end

    [list_json, collection.count]
  end

  def create_for_all_locales
    saved_name = self.name
    
    LocaleLooper.run do
      self.name = saved_name
    end

    self.save
  end
end
