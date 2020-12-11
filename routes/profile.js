const express = require("express");
const User = require("../models/user");
const Project = require("../models/project");
const multer = require("multer");
const path = require("path");

//Init storage
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

//Init upload
var upload = multer({
  storage: storage
});

//Init router
const router = express.Router();

router.get("/profile/:id", isLoggedIn, function(req, res) {
  User.find({ _id: req.params.id }, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      var user = users[0];
      Project.find({ "author.id": user._id }, function(err, projects) {
        if (err) {
          console.log(err);
        } else {
          User.findById(req.user._id)
            .populate("courses.id")
            .exec(function(err, currentUser) {
              if (err) console.log(err);
              else {
                res.render("profile", {
                  user: user,
                  currentUser: currentUser,
                  projects: projects,
                  courses: currentUser.courses
                });
                // console.log("Courses: " + currentUser);
              }
            });
        }
      });
    }
  });
});

router.get("/profile/:id/edit", checkProfileOwnership, function(req, res) {
  User.find({ _id: req.params.id }, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      var user = users[0];
      res.render("edit", { user: user });
    }
  });
});

router.put("/profile/:id", checkProfileOwnership, function(req, res) {
  //get current user
  var currentUser = req.user;
  //update bio
  currentUser.email = req.body.email;
  currentUser.bio = req.body.bio;
  // currentUser.image = req.body.image;
  currentUser.name = req.body.name;
  currentUser.save(function(err, updatedUser) {
    if (err) {
      console.log(err);
    }

    res.redirect("/profile/" + updatedUser._id);
  });
});

//Create a new project
router.post("/profile/:id/projects", checkProfileOwnership, function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      Project.create(
        { name: req.body.name, description: req.body.description },
        function(err, project) {
          if (err) {
            console.log(err);
            res.redirect("back");
          } else {
            // console.log(project);

            // console.log("PROJECT");

            // add user and id
            project.author.id = user._id;
            project.author.username = user.username;

            upload.single("sampleFile")(req, res, function(err) {
              if (err) {
                console.log(err);
              } else {
                // console.log("Upload successfully");
                // console.log(req.file);
                project.name = req.body.name;
                project.description = req.body.description;
                if (!req.file || Object.keys(req.file).length === 0) {
                  project.image = "/uploads/avatar.png";
                } else {
                  project.image = "/uploads/" + req.file.filename;
                }

                project.save(function(err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Save project image successfully");
                  }
                  res.redirect("/profile/" + user._id);
                });
              }
            });
          }
        }
      );
    }
  });
});

// Upload profile image
router.post("/profile/:id/upload", checkProfileOwnership, function(req, res) {
  User.findById(req.params.id, function(err, profile) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      upload.single("sampleFile")(req, res, function(err) {
        if (err) {
          console.log(err);
          res.redirect("back");
        } else {
          // console.log("Upload successfully");
          // console.log(req.file);
          if (!req.file || Object.keys(req.file).length === 0) {
            profile.image = "/uploads/avatar.png";
          } else {
            profile.image = "/uploads/" + req.file.filename;
          }

          profile.save(function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Save profile image successfully");
            }
            res.redirect("back");
          });
        }
      });
    }
  });
});

//Detele project
router.delete(
  "/profile/:id/projects/:project_id",
  checkProfileOwnership,
  function(req, res) {
    Project.findByIdAndRemove(req.params.project_id, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("Delete successful");
        res.redirect("back");
      }
    });
  }
);

//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkProfileOwnership(req, res, next) {
  // Check authentication first
  if (req.isAuthenticated()) {
    // check authorization
    // Compare current user's id with the id of the page
    if (req.params.id === req.user._id.toString()) {
      next();
    } else {
      res.redirect("/profile/" + req.user._id);
    }
  } else {
    res.redirect("/profile/" + req.user._id);
  }
}

module.exports = router;
