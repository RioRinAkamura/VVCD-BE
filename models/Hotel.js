const mongoose = require("mongoose")
const Schema = mongoose.Schema

const HotelsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    pictures: {
        type: [String],
        required: true,
    },
    rate: {
        type: Number,
    },
    price: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("hotels", HotelsSchema);