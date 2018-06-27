"use strict";

module.exports = function(app) {
  app.use(function(req, res, next) {
    console.log(req.headers);
    if (req.headers["worldcupapp321"] === "appforlife123") {
      return next();
    }
    res.json({ err: "unauthorized" });
  });
};
