class Admin::Collection
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug
  include CollectionConcern

  embeds_one :image, class_name: "Admin::CollectionImage"
  embeds_many :products, class_name: "Admin::Product"

  after_create :create_for_all_locales

  scope :names, -> { only(:name, :_slugs) }

  def self.search(search, pagination, sorting)
    ### this query does NOT provide a way to get products_count
    # query = self.or({name: {'$regex' => search}}, {:description => {'$regex' => search}})
    #             .only(:name, :description, :published, :created_at, :updated_at)
    #             .order_by(sorting[:field]=> sorting[:direction])
    #             .skip(pagination[:skip])
    #             .limit(pagination[:take])

    # [query, self.count]


    directions = { asc: 1, desc: -1 }
    
    list_json = collection
    .aggregate([
      { '$match' => {
          '$or' => [
            {"name.#{I18n.locale}" => {'$regex' => search}},
            {"description.#{I18n.locale}" => {'$regex' => search}}
          ]
        }
      },
      { '$project' => {
          "name.#{I18n.locale}" => 1, 
          "description.#{I18n.locale}" => 1, 
          :_slugs => 1,
          :published => 1, 
          :updated_at => 1,
          :image => 1,
          :products_count => { '$size' => { '$ifNull' => ['$products', []] } }
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
      item_json["description"] = item_json["description"][I18n.locale]
      self.new(item_json)
    end

    [list_json, collection.count]
  end

  def create_for_all_locales
    puts "create_for_all_locales"
    saved_name = self.name
    puts saved_name
    saved_description = self.description
    puts saved_description

    puts LocaleLooper.inspect
    puts self.inspect

    puts "before run"

    LocaleLooper.run do
      puts "inside run"
      puts self.inspect
      self.name = saved_name
      puts self.name
      self.description = saved_description
      puts self.description
    end

    puts "after run"

    self.save
  end
end
