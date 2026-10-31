# Builds records the way the admin does (Admin:: models), so localized fields exist for all locales.
module DataHelpers
  def create_collection(name = 'Spring', **attrs)
    Admin::Collection.create!({ name: name, description: "About #{name}", published: true }.merge(attrs))
  end

  def create_product(collection, name = 'Dress', **attrs)
    collection.products.create!({ name: name, description: "About #{name}", published: true }.merge(attrs))
  end

  def create_image(parent, url = 'https://img.example.test/a.jpg', **attrs)
    parent.images.create!({ url: url }.merge(attrs))
  end
end

RSpec.configure { |config| config.include DataHelpers, type: :request }
