const express = require("express");

//Init router
const router = express.Router();

router.get("/home", isLoggedIn, function(req, res) {
  res.render("home", { user: req.user });
});

//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
