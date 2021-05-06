var Artist = require("../models/Artist");

exports.list = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Artist list");
};

exports.detail = function (req, res, next) {
  res.send("Arist detail: " + req.params.id);
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
