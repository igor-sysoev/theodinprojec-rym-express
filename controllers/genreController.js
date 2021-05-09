var Genre = require("../models/Genre");
var helpers = require("./helpers");

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
  res.render("genre_form");
};

exports.create_post = [
  (req, res, next) => {
    var genre = new Genre(req.body);

    genre.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/catalog/genres/" + genre._id);
    });
  },
];

exports.delete_get = function (req, res, next) {
  Genre.findById(req.params.id)
    .lean()
    .exec(function (err, genre) {
      if (err) {
        return next(err);
      }
      res.render("delete", { item: genre });
    });
};

exports.delete_post = function (req, res, next) {
  Genre.findByIdAndRemove(req.params.id).exec(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/genres");
  });
};

exports.update_get = function (req, res, next) {
  Genre.findById(req.params.id)
    .lean()
    .exec(function (err, genre) {
      if (err) {
        return next(err);
      }
      res.render("genre_form", { genre });
    });
};

exports.update_post = [
  (req, res, next) => {
    var genre = new Genre({ ...req.body, _id: req.params.id });

    Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/catalog/genres/" + genre._id);
    });
  },
];
