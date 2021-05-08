var Genre = require("../models/Genre");

exports.list = function (req, res, next) {
  Genre.find({})
    .lean()
    .exec(function (err, genre_list) {
      if (err) {
        return next(err);
      }

      res.render("genre_list", { genre_list });
    });
};

exports.detail = function (req, res, next) {
  Genre.findById(req.params.id)
    .lean()
    .exec(function (err, genre) {
      if (err) {
        return next(err);
      }
      res.render("genre_detail", { genre });
    });
};
// crud
exports.create_get = function (req, res, next) {
  res.send("genre bandform");
};

exports.create_post = function (req, res, next) {
  res.send("Create genree Post");
};

exports.delete_get = function (req, res, next) {
  res.send("Delete genree Form");
};

exports.delete_post = function (req, res, next) {
  res.send("Delete genre Post");
};

exports.update_get = function (req, res, next) {
  res.send("Update genre form");
};

exports.update_post = function (res, res, next) {
  res.send("Update genre form");
};
