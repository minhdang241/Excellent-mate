var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  bio: String,
  image: String,
  isAdmin: Boolean,
  courses: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      },
      target: String
    }
  ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
