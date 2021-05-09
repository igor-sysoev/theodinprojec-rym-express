var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var BandSchema = new Schema({
  name: { type: String, required: true },
  releases: [{ type: Schema.ObjectId, ref: "Release" }],
  founded: { type: Date },
  disbanded: { type: Date },
});

BandSchema.virtual("url").get(function () {
  return "/catalog/bands/" + this._id;
});

module.exports = mongoose.model("Band", BandSchema);
