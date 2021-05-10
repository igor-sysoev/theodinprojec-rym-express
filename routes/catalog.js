var express = require("express");
var router = express.Router();

var artist_controller = require("../controllers/artistController");
var band_controller = require("../controllers/bandController");
var genre_controller = require("../controllers/genreController");
var release_controller = require("../controllers/releaseController");

var routeArr = [
  {
    key: "releases",
    controller: release_controller,
  },
  {
    key: "artists",
    controller: artist_controller,
  },
  {
    key: "genres",
    controller: genre_controller,
  },
  {
    key: "bands",
    controller: band_controller,
  },
];
// Releases

routeArr.forEach(function (path) {
  router.get(`/${path.key}/create`, path.controller.create_get);
  router.post(`/${path.key}/create`, path.controller.create_post);

  router.get(`/${path.key}`, path.controller.list);
  router.get(`/${path.key}/:id`, path.controller.detail);

  router.get(`/${path.key}/:id/update`, path.controller.update_get);
  router.post(`/${path.key}/:id/update`, path.controller.update_post);

  router.get(`/${path.key}/:id/delete`, path.controller.delete_get);
  router.post(`/${path.key}/:id/delete`, (req, res, next) => {
    if (req.body.password === "password") {
      path.controller.delete_post(req, res, next);
    } else {
      res.render("wrong_password", { path: path.key });
    }
  });
});

router.get("/", release_controller.index);

module.exports = router;
