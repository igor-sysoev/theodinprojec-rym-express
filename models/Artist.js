var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArtistSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  member_of: { type: Schema.ObjectId, ref: "Band" },
});

ArtistSchema.virtual("url").get(function () {
  return "/catalog/artists/" + this._id;
});

module.exports = mongoose.model("Artist", ArtistSchema);
