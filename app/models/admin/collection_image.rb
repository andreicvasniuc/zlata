class Admin::CollectionImage < Admin::Image
  embedded_in :product_collection, class_name: "Admin::Collection"
end