var mongoose = require("mongoose");

var projectSchema = mongoose.Schema({
    name: String, 
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
    
});

module.exports = mongoose.model("Project", projectSchema);