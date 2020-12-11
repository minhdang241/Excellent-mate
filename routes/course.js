const express = require("express");
const Course = require("../models/course");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const router = express.Router();
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

router.get("/courses", function(req, res) {
  // Get all courses from DB
  Course.find({}, function(err, courses) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      upload.single();
      res.render("course-list", { currentUser: req.user, courses: courses });
    }
  });
});
//Create a new course
router.post("/courses", function(req, res) {
  upload.single("courseImage")(req, res, function(err) {
    if (err) {
      console.log(err);
    } else {
      const { name, courseId, courseDescription } = req.body;
      //Create a new course
      Course.create(
        {
          name,
          courseId,
          description: courseDescription
        },
        function(err, newCourse) {
          if (err) {
            console.log(err);
          } else {
            newCourse.id = newCourse._id;
            if (!req.file || Object.keys(req.file).length === 0) {
              newCourse.image = "/uploads/avatar.png";
            } else {
              newCourse.image = "/uploads/" + req.file.filename;
            }

            newCourse.save(function(err) {
              if (err) console.log(err);
              res.redirect("back");
            });
          }
        }
      );
    }
  });
});

//Get the detail of the course
router.get("/courses/:id", function(req, res) {
  //Find the course
  Course.findById(req.params.id, function(err, course) {
    if (err) {
      console.log(err);
    } else {
      // console.log("Course", course);

      // Find the current user
      User.findById(req.user._id)
        .populate("courses.id")
        .exec(function(err, currentUser) {
          if (err) console.log(err);
          else {
            let currentUserTarget = "";
            currentUser.courses.forEach(aCourse => {
              // console.log(aCourse.target);

              if (aCourse.id._id.equals(course._id)) {
                currentUserTarget = aCourse.target;
                // console.log(currentUserTarget);

                return;
              }
            });
            // console.log("Current Course", currentUser.courses);

            //Find a list of people following the course
            User.find({ "courses.id": course._id }, function(err, people) {
              if (err) {
                console.log(err);
              } else {
                // console.log("People", people[0].courses);

                res.render("course", {
                  course: course,
                  currentUser: currentUser,
                  currentUserCourses: currentUser.courses,
                  people: people,
                  currentTarget: currentUserTarget
                });
              }
            });
          }
        });
    }
  });
});

//Delete a course
router.delete("/courses/:id", function(req, res) {
  Course.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Delete successful");
      res.redirect("/courses");
    }
  });
});

//Follow a course
router.get("/courses/:id/follow", function(req, res) {
  Course.findById(req.params.id, function(err, course) {
    if (err) {
      console.log(err);
    } else {
      // console.log("Course", course);

      const addedCourse = {
        id: course._id,
        target: "Not target yet"
      };
      console.log(addedCourse);

      req.user.courses.push(addedCourse);

      req.user.save(function(err) {
        if (err) console.log(err);
        else {
          console.log("Following course successfully");
        }
       
      });
    }
  });
});

//Unfollow the course
router.get("/courses/:id/unfollow", function(req, res) {
  Course.findById(req.params.id, function(err, course) {
    if (err) {
      console.log(err);
    } else {
      let index = 0;
      for (index; index < req.user.courses.length; index++) {
        const aCourse = req.user.courses[index];
        if (aCourse.id.equals(course._id)) {
          console.log("True");
          break;
        }
      }
      req.user.courses.splice(index, 1);
      console.log(req.user.courses);
      req.user.save(function(err) {
        if (err) console.log(err);
        else {
          console.log("Unfollowing course successfully");
        
        }
      });
    }
  });
});

//Update the target in the course
router.put("/courses/:course_id/:user_id/target", (req, res) => {
  Course.findById(req.params.course_id, (err, course) => {
    if (err) console.log(err);
    else {
      console.log("Target");

      User.findById(req.params.user_id, (err, currentUser) => {
        currentUser.courses.forEach(aCourse => {
          if (aCourse.id._id.equals(course._id)) {
            aCourse.target = req.body.target;
            return;
          }
        });

        currentUser.save(err => {
          if (err) console.log(err);
          else {
            res.redirect("back");
          }
        });
      });
    }
  });
});
module.exports = router;
