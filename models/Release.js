var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ReleaseSchema = new Schema({
  title: { type: String, required: true },
  band: { type: Schema.ObjectId, ref: "Band" },
  artist: { type: Schema.ObjectId, ref: "Artist" },
  cover: { type: String, required: true },
  genre: { type: Schema.ObjectId, ref: "Genre" },
  rating: String,
  description: String,
  date: Date,
});

ReleaseSchema.virtual("url").get(function () {
  return "/catalog/release/" + this._id;
});

module.exports = mongoose.model("Release", ReleaseSchema);
