var Genre = require("../models/Genre");
var Release = require("../models/Release");
var helpers = require("./helpers");
var async = require("async");

const { body, validationResult } = require("express-validator");

exports.list = function (req, res, next) {
  Genre.find({})
    .lean()
    .exec(function (err, genre_list) {
      if (err) {
        return next(err);
      }

      res.render("genre_list", { list: genre_list, genrePage: true });
    });
};

exports.detail = function (req, res, next) {
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).lean().exec(callback);
      },
      releases: function (callback) {
        Release.find({ genre: req.params.id }).lean().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("genre_detail", {
        genre: results.genre,
        releases: results.releases,
      });
    }
  );
};
// crud
exports.create_get = function (req, res, next) {
  res.render("genre_form");
};

exports.create_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
    }
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
  async.parallel(
    {
      genre: function (callback) {
        Genre.findById(req.params.id).lean().exec(callback);
      },
      releases: function (callback) {
        Release.find({ genre: req.params.id }).lean().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("delete", {
        item: results.genre,
        conflicting_items: results.releases,
      });
    }
  );
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
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    var genre = new Genre({ ...req.body, _id: req.params.id });
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/genres/" + genre._id);
      });
    }
  },
];
