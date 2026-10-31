# Keeps the JSON format of ids the same as with Mongoid 7 / bson 4: {"_id": {"$oid": "..."}}.
# bson 5 / Mongoid 9 render an ObjectId as a plain string, but the committed AngularJS frontend
# and lib/data_processor.rb read `_id.$oid`.
module BsonObjectIdAsJsonOid
  def as_json(*)
    { "$oid" => to_s }
  end
end

BSON::ObjectId.prepend(BsonObjectIdAsJsonOid)
