const express = require("express");
const passport = require("passport");
const User = require("../models/user");

//Init router
const router = express.Router();

// Landing page
router.get("/", isLoggedOut, function(req, res) {
  res.render("landing");
});

// Register
router.get("/register", isLoggedOut, function(req, res) {
  res.render("register");
});

router.post("/register", isLoggedOut, function(req, res) {
  var newUser = new User({
    username: req.body.username,
    image: "/images/avatar.png",
    name: "User",
    bio: "Write your job title here",
    email: req.body.email,
    isAdmin: false
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/profile/"+ user._id);
    });
  });
});

//Log in
router.get("/login", isLoggedOut, function(req, res) {
  res.render("login");
});

router.post(
  "/login",
  isLoggedOut,
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    res.redirect('/profile/' + req.user._id);
  }
);

//Log out
router.get("/logout", isLoggedIn, function(req, res) {
  req.logout();
  res.redirect("/login");
});

//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function isLoggedOut(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/profile/"+req.user._id);
}

module.exports = router;
