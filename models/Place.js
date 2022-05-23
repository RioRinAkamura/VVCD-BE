const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PlacesSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    pictures: {
        type: [String],
        required: true,
    },
    distance: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["HISTORY", "NATURAL"]
    }
});

module.exports = mongoose.model("places", PlacesSchema);