var mongoose = require("mongoose");

var courseSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    courseId: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Course", courseSchema);