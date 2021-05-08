var Artist = require("../models/Artist");

exports.list = function (req, res, next) {
  Artist.find({})
    .lean()
    .exec(function (err, artist_list) {
      if (err) {
        return next(err);
      }
      res.render("artist_list", { artist_list });
    });
};

exports.detail = function (req, res, next) {
  Artist.findById(req.params.id)
    .lean()
    .exec(function (err, artist) {
      if (err) {
        return next(err);
      }
      res.render("artist_detail", { artist });
    });
};
// crud
exports.create_get = function (req, res, next) {
  res.send("Create artist form");
};

exports.create_post = function (req, res, next) {
  res.send("Create artist Post");
};

exports.delete_get = function (req, res, next) {
  res.send("Delete Artist Form");
};

exports.delete_post = function (req, res, next) {
  res.send("Delete Artist Post");
};

exports.update_get = function (req, res, next) {
  res.send("Update artist form");
};

exports.update_post = function (res, res, next) {
  res.send("Update artist form");
};
