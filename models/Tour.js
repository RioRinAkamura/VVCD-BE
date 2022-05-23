const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ToursSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    pictures: {
        type: [String],
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("tours", ToursSchema);