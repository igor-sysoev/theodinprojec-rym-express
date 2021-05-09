const helpers = {
  isEqual: function (a, b) {
    if (a && b) return a.toString() == b.toString();
  },
};

module.exports = helpers;
