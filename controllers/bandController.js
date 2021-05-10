var Band = require("../models/Band");
var helpers = require("./helpers");
var async = require("async");
var Release = require("../models/Release");
var Artist = require("../models/Artist");

const { body, validationResult } = require("express-validator");

exports.list = function (req, res, next) {
  Band.find({})
    .lean()
    .exec(function (err, band_list) {
      if (err) {
        return next(err);
      }
      res.render("band_list", { list: band_list, bandPage: true });
    });
};

exports.detail = function (req, res, next) {
  async.parallel(
    {
      band: function (callback) {
        Band.findById(req.params.id).populate("members").lean().exec(callback);
      },
      releases: function (callback) {
        Release.find({ band: req.params.id }).lean().exec(callback);
      },
      members: function (callback) {
        Artist.find({ member_of: req.params.id }).lean().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      res.render("band_detail", {
        band: results.band,
        band_members: results.members,
        releases: results.releases,
      });
    }
  );
};
// crud
exports.create_get = function (req, res, next) {
  res.render("band_form");
};

exports.create_post = [
  (req, res, next) => {
    const errors = validationResult(req);
    let band = new Band(req.body);
    if (!errors.isEmpty()) {
      if (err) return next(err);
      res.render("band_form", { band: req.body });
    } else {
      band.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/bands/" + band._id);
      });
    }
  },
];
exports.delete_get = function (req, res, next) {
  Band.findById(req.params.id)
    .lean()
    .exec(function (err, band) {
      if (err) {
        return next(err);
      }
      res.render("delete", { item: band });
    });
};

exports.delete_post = function (req, res, next) {
  Band.findByIdAndRemove(req.params.id).exec(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/bands");
  });
};

exports.update_get = function (req, res, next) {
  Band.findById(req.params.id)
    .lean()
    .exec(function (err, band) {
      if (err) {
        return next(err);
      }
      res.render("band_form", { band });
    });
};

exports.update_post = [
  (req, res, next) => {
    const errors = validationResult(req);
    let band = new Band({ ...req.body, _id: req.params.id });
    if (!errors.isEmpty()) {
      if (err) return next(err);
      res.render("band_form", { band: req.body });
    } else {
      Band.findByIdAndUpdate(req.params.id, band, {}, function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/bands/" + band._id);
      });
    }
  },
];
