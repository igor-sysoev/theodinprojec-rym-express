var Artist = require("../models/Artist");
var Band = require("../models/Band");
var Release = require("../models/Release");
var async = require("async");
var helpers = require("./helpers");

const { body, validationResult } = require("express-validator");

exports.list = function (req, res, next) {
  Artist.find({})
    .lean()
    .exec(function (err, artist_list) {
      if (err) {
        return next(err);
      }
      res.render("artist_list", { list: artist_list, artistPage: true });
    });
};

exports.detail = function (req, res, next) {
  async.parallel(
    {
      artist: function (callback) {
        Artist.findById(req.params.id)
          .populate("member_of")
          .lean()
          .exec(callback);
      },
      releases: function (callback) {
        Release.find({ artist: req.params.id }).lean().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("artist_detail", {
        artist: results.artist,
        releases: results.releases,
      });
    }
  );
};
// crud
exports.create_get = function (req, res, next) {
  async.parallel(
    {
      bands: function (callback) {
        Band.find({}).lean().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("artist_form", { bands: results.bands, helpers });
    }
  );
};

exports.create_post = [
  body("name", "Artist name must contain at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description").trim().escape(),
  (req, res, next) => {
    if (req.body.member_of === "None") {
      req.body.member_of = null;
    }

    next();
  },

  (req, res, next) => {
    const errors = validationResult(req);
    let artist = new Artist(req.body);
    if (!errors.isEmpty()) {
      Band.find({})
        .lean()
        .exec(function (err, bands) {
          if (err) return next(err);
          res.render("artist_form", {
            artist: req.body,
            bands,
            errors: errors.array(),
            helpers,
          });
        });
    } else {
      artist.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/artists/" + artist._id);
      });
    }
  },
];
exports.delete_get = function (req, res, next) {
  async.parallel(
    {
      artist: function (callback) {
        Artist.findById(req.params.id).lean().exec(callback);
      },
      releases: function (callback) {
        Release.find({ artist: req.params.id }).lean().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("delete", {
        item: results.artist,
        conflicting_items: results.releases,
      });
    }
  );
};

exports.delete_post = function (req, res, next) {
  Artist.findByIdAndRemove(req.params.id).exec(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/artists");
  });
};

exports.update_get = function (req, res, next) {
  async.parallel(
    {
      artist: function (callback) {
        Artist.findById(req.params.id).lean().exec(callback);
      },
      bands: function (callback) {
        Band.find({}).lean().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("artist_form", {
        artist: results.artist,
        bands: results.bands,
        helpers,
      });
    }
  );
};

exports.update_post = [
  body("name", "Artist name must contain at least 1 character")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description").trim().escape(),
  (req, res, next) => {
    if (req.body.member_of === "None") {
      req.body.member_of = null;
    }
    next();
  },

  (req, res, next) => {
    const errors = validationResult(req);
    let artist = new Artist({ ...req.body, _id: req.params.id });
    if (!errors.isEmpty()) {
      Band.find({})
        .lean()
        .exec(function (err, bands) {
          if (err) return next(err);
          res.render("artist_form", {
            artist: req.body,
            bands,
            errors: errors.array(),
            helpers,
          });
        });
    } else {
      Artist.findByIdAndUpdate(req.params.id, artist, {}, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/artists/" + artist._id);
      });
    }
  },
];
