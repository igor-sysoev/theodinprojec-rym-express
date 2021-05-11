var Release = require("../models/Release");
var Artist = require("../models/Artist");
var Genre = require("../models/Genre");
var Band = require("../models/Band");
var async = require("async");
var helpers = require("./helpers");
const multer = require("multer");

const { body, validationResult } = require("express-validator");

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./public/images");
  },

  // add back the extensions

  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

// upload params for multer

const upload = multer({
  storage,
  limits: {
    fileSize: "8 MB",
  },
});

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
  Release.find({})
    .lean()
    .populate("band artist")
    .exec(function (err, list) {
      if (err) {
        return next(err);
      } else {
        res.render("release_list", {
          title: "Releases",
          list,
          releasePage: true,
        });
      }
    });
};

exports.detail = function (req, res, next) {
  Release.findById(req.params.id)
    .lean()
    .populate("band artist genre")
    .exec(function (err, release) {
      if (err) {
        return next(err);
      } else {
        res.render("release_detail", {
          title: "Release",
          release,
        });
      }
    });
};
// crud
exports.create_get = function (req, res, next) {
  async.parallel(
    {
      bands: function (callback) {
        Band.find({}).lean().exec(callback);
      },
      artists: function (callback) {
        Artist.find({}).lean().exec(callback);
      },
      genres: function (callback) {
        Genre.find({}).lean().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      } else {
        res.render("release_form", {
          title: "Create Release",
          artists: results.artists,
          bands: results.bands,
          genres: results.genres,
          helpers,
        });
      }
    }
  );
};

exports.create_post = [
  body("title")
    .trim()

    .escape(),
  body("description").trim().escape(),
  upload.single("cover"),
  (req, res, next) => {
    async.parallel(
      {
        artist: function (callback) {
          Artist.findById(req.body.creator).exec(callback);
        },
        band: function (callback) {
          Band.findById(req.body.creator).exec(callback);
        },
      },
      function (err, results) {
        if (err) {
          return next(err);
        }
        if (results.artist !== null) {
          req.body.artist = results.artist;
          delete req.body.creator;
        } else if (results.creator !== null) {
          req.body.band = results.band;
          delete req.body.creator;
        }
        next();
      }
    );
  },

  // body("title", "Title must not be empty.")
  //   .trim()
  //   .isLength({ min: 1 })
  //   .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    let release = new Release({ ...req.body, cover: req?.file?.filename });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          bands: function (callback) {
            Band.find({}).lean().exec(callback);
          },
          artists: function (callback) {
            Artist.find({}).lean().exec(callback);
          },
          genres: function (callback) {
            Genre.find({}).lean().exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          } else {
            res.render("release_form", {
              title: "Create Release",
              artists: results.artists,
              bands: results.bands,
              genres: results.genres,
              release: req.body,
              helpers,
              errors: errors.array(),
            });
          }
        }
      );
    } else {
      release.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/releases/" + release._id);
      });
    }
  },
];

exports.delete_get = function (req, res, next) {
  Release.findById(req.params.id)
    .lean()
    .exec(function (err, release) {
      if (err) {
        return next(err);
      }
      res.render("delete", { item: release });
    });
};

exports.delete_post = function (req, res, next) {
  Release.findByIdAndRemove(req.params.id).exec(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/catalog/releases");
  });
};

exports.update_get = function (req, res, next) {
  async.parallel(
    {
      bands: function (callback) {
        Band.find({}).lean().exec(callback);
      },
      artists: function (callback) {
        Artist.find({}).lean().exec(callback);
      },
      release: function (callback) {
        Release.findById(req.params.id)
          .lean()
          .populate("artist band genre")
          .exec(callback);
      },
      genres: function (callback) {
        Genre.find({}).lean().exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      } else {
        res.render("release_form", {
          title: "Create Release",
          artists: results.artists,
          bands: results.bands,
          release: results.release,
          genres: results.genres,
          helpers,
        });
      }
    }
  );
};

exports.update_post = [
  body("title").trim().escape(),
  body("description").trim().escape(),
  (req, res, next) => {
    if (!req.body.cover) {
      Release.findById(req.params.id).exec(function (err, release) {
        req.file = {};
        req.file.filename = release.cover;
        upload.single("cover");
      });
    }
    next();
  },

  (req, res, next) => {
    async.parallel(
      {
        artist: function (callback) {
          Artist.findById(req.body.creator).exec(callback);
        },
        band: function (callback) {
          Band.findById(req.body.creator).exec(callback);
        },
      },
      function (err, results) {
        if (err) {
          return next(err);
        }
        if (results.artist !== null) {
          req.body.artist = results.artist;
          delete req.body.creator;
        } else if (results.creator !== null) {
          req.body.band = results.band;
          delete req.body.creator;
        }
        next();
      }
    );
  },
  // body("title", "Title must not be empty.")
  //   .trim()
  //   .isLength({ min: 1 })
  //   .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    let release = new Release({
      ...req.body,
      _id: req.params.id,
      cover: req?.file?.filename,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          bands: function (callback) {
            Band.find({}).lean().exec(callback);
          },
          artists: function (callback) {
            Artist.find({}).lean().exec(callback);
          },
          genres: function (callback) {
            Genre.find({}).lean().exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          } else {
            res.render("release_form", {
              title: "Update Release",
              artists: results.artists,
              bands: results.bands,
              genres: results.genres,
              release: req.body,
              helpers,
              errors: errors.array(),
            });
          }
        }
      );
      res.redirect("/catalog/releases");
    } else {
      Release.findByIdAndUpdate(
        req.params.id,
        release,
        {},
        function (err, newRelease) {
          if (err) {
            return next(err);
          }
          res.redirect("/catalog/releases/" + newRelease.id);
        }
      );
    }
  },
];
