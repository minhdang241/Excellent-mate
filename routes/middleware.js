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
    res.redirect("/home");
  }
  
  function checkProfileOwnership(req, res, next) {
    // Check authentication first
    if (req.isAuthenticated()) {
      // check authorization
      // Compare current user's id with the id of the page
      if (req.params.id === req.user._id.toString()) {
        next();
      } else {
        res.redirect("/home");
      }
    } else {
      res.redirect("/home");
    }
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
            res.redirect("/home");
          }
        }
      });
    } else {
      res.redirect("/home");
    }
  }