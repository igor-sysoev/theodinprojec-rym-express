var Release = require("../models/Release");
var Artist = require("../models/Artist");
var Genre = require("../models/Genre");
var Band = require("../models/Band");
var async = require("async");

exports.index = function (req, res, next) {
  async.parallel(
    {
      release_count: function (callback) {
        Release.countDocuments({}, callback);
      },
      artist_count: function (callback) {
        Artist.countDocuments({}, callback);
      },
      band_count: function (callback) {
        Band.countDocuments({}, callback);
      },
      genre_count: function (callback) {
        Genre.countDocuments({}, callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      res.render("index", { title: "Home page", data: results });
    }
  );
};

exports.list = function (req, res, next) {
  Release.find({}, "title band artist date cover")
    .populate("band artist")
    .exec(function (err, list) {
      if (err) {
        return next(err);
      } else {
        console.log(list);
        res.render("release_list", {
          title: "boobo",
          release_list: list,
        });
      }
    });
};

exports.detail = function (req, res, next) {
  Release.findById(req.params.id).populate("band artist");
};
// crud
exports.create_get = function (req, res, next) {
  res.send("release bandform");
};

exports.create_post = function (req, res, next) {
  res.send("Create release Post");
};

exports.delete_get = function (req, res, next) {
  res.send("Delete release Form");
};

exports.delete_post = function (req, res, next) {
  res.send("Delete release Post");
};

exports.update_get = function (req, res, next) {
  res.send("Update release form");
};

exports.update_post = function (res, res, next) {
  res.send("Update release form");
};
