var mongoose = require("mongoose");

var milestoneSchema = mongoose.Schema({
    attachments: [],
    date: Date,
    title: String, 
    description: String,
    project: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }, 
        projectName: String
    }
});

module.exports = mongoose.model("MileStone", milestoneSchema);


