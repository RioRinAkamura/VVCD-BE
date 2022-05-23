const mongoose = require("mongoose")
const Schema = mongoose.Schema

const FoodsSchema = new Schema({
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
    price: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("foods", FoodsSchema);