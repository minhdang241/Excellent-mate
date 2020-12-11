const express = require("express");
const User = require("../models/user");
const Project = require("../models/project");
const MileStone = require("../models/milestone");
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

router.get("/projects", isLoggedIn, function(req, res) {
  //Find all the projects
  Project.find({}, function(err, projectList) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("project-list", { user: req.user, projectlist: projectList });
    }
  });
});

router.get("/projects/:id", isLoggedIn, function(req, res) {
  Project.findById(req.params.id, function(err, project) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      User.findById(project.author.id, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          MileStone.find({ "project.id": project.id }, function(
            err,
            milestones
          ) {
            if (err) {
              console.log(err);
            } else {
              res.render("project", {
                project: project,
                user: user,
                milestones: milestones,
                currentUser: req.user
              });
            }
          });
        }
      });
    }
  });
});



//Update Project
router.put("/projects/:id", checkProjectOwnership, function(req, res) {
  Project.findById(req.params.id, function(err, project) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      project.name = req.body.projectName;
      project.description = req.body.description;
      project.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully save");
        }
        res.redirect("back");
      });
    }
  });
});

//Upload project image
router.post("/projects/:id/upload", checkProjectOwnership, function(req, res) {
  Project.findById(req.params.id, function(err, project) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      upload.single("sampleFile")(req, res, function(err) {
        if (err) {
          console.log(err);
          res.redirect("back");
        } else {
          console.log("Upload successfully");
          console.log(req.file);

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
            res.redirect("back");
          });
        }
      });
    }
  });
});

//=============
//MILESTONE
//=============
//Create a new milestone
router.post("/projects/:id/milestones", checkProjectOwnership, function(req, res) {
  upload.array("images")(req, res, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully Upload Images");
      // res.redirect('/projects/' + req.params.id);

      Project.findById(req.params.id, function(err, project) {
        if (err) {
          console.log(err);
          res.redirect("back");
        } else {
          console.log(req.body.date);
          MileStone.create(
            {
              title: req.body.title,
              description: req.body.description,
              date: new Date(req.body.date)
            },
            function(err, milestone) {
              if (err) {
                console.log(err);
              } else {
                milestone.project.id = project._id;
                milestone.project.projectName = project.name;

                // Upload file

                console.log(req.files);

                milestone.attachments = req.files;

                milestone.save(function(err, savedMilestone) {
                  if (err) {
                    console.log(err);
                    res.redirect("back");
                  } else {
                    console.log("Save successfully");
                    console.log(savedMilestone);
                    res.redirect("back");
                  }
                });
              }
            }
          );
        }
      });
    }
  });
});

//Update milestone
router.put(
  "/projects/:id/milestones/:milestone_id",
  checkProjectOwnership,
  function(req, res) {
    Project.findById(req.params.id, function(err, project) {
      if (err) {
        console.log(err);
      } else {
        MileStone.findById(req.params.milestone_id, function(err, milestone) {
          if (err) {
            console.log("Error");

            console.log(err);
          } else {
            milestone.title = req.body.title;
            milestone.description = req.body.description;
            milestone.save(function(err) {
              if (err) {
                console.log(err);
              }
              console.log("Save successfully!");
            });

            res.redirect("back");
          }
        });
      }
    });
  }
);

//Delete milestone
router.delete(
  "/projects/:id/milestones/:milestone_id",
  checkProjectOwnership,
  function(req, res) {
    MileStone.findByIdAndRemove(req.params.milestone_id, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Delete Successful");
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

function checkProjectOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    // check authorization

    Project.findById(req.params.id, function(err, project) {
      if (err) {
        console.log(err);
      } else {
        if (project.author.id.toString() === req.user._id.toString()) {
          next();
        } else {
          res.redirect("/profile/" + req.user._id);
        }
      }
    });
  } else {
    res.redirect("/profile/" + req.user._id);
  }
}

module.exports = router;
