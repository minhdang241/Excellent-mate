var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  User = require("./models/user"),
  methodOverride = require("method-override"),
  LocalStrategy = require("passport-local"),
  multer = require("multer"),
  path = require("path");

//Import routers
const indexRoutes = require("./routes/index");
const homeRoutes = require("./routes/home");
const courseRoutes = require("./routes/course");
const projectRoutes = require("./routes/project");
const profileRoutes = require("./routes/profile");

mongoose.connect('mongodb://localhost:27017/profile_feature', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static("./public"));

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// override with POST having ?_method=...
app.use(methodOverride("_method"));

// Authentication router
app.use(indexRoutes);
// app.use(homeRoutes);
app.use(courseRoutes);
app.use(projectRoutes);
app.use(profileRoutes);


app.listen(3000, function() {
  console.log("The server has started!");
});
