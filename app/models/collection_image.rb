class CollectionImage < Image
  embedded_in :product_collection, class_name: "Collection"
end
