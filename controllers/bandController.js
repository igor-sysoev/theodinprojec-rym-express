var Band = require("../models/Band");

exports.list = function (req, res, next) {
  Band.find({})
    .lean()
    .exec(function (err, band_list) {
      if (err) {
        return next(err);
      }
      res.render("band_list", { band_list });
    });
};

exports.detail = function (req, res, next) {
  Band.findById(req.params.id)
    .lean()
    .exec(function (err, band) {
      if (err) {
        return next(err);
      }
      res.render("band_detail", { band });
    });
};
// crud
exports.create_get = function (req, res, next) {
  res.send("Create bandform");
};

exports.create_post = function (req, res, next) {
  res.send("Create band Post");
};

exports.delete_get = function (req, res, next) {
  res.send("Delete band Form");
};

exports.delete_post = function (req, res, next) {
  res.send("Delete band Post");
};

exports.update_get = function (req, res, next) {
  res.send("Update aband form");
};

exports.update_post = function (res, res, next) {
  res.send("Update band form");
};
