const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken")

const Food = require("../models/Food");

// @Route POST api/foods
// @desc Create food
// access Private
router.post("/", verifyToken, async (req, res) => {
    const { title, description, pictures, price } = req.body

    // validation
    if (!title || !description || !pictures || !price) {
        res.status(400).json({ success: false, message: "Please fill out the form!" })
    }

    try {
        const newFood = new Food({
            title, description, pictures, price
        })
        await newFood.save();
        res.status(200).json({ success: true, message: "Created new food successfully!", food: newFood })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

// @Route GET api/foods
// @desc Get foods
// access Private
router.get("/", verifyToken, async (req, res) => {
    try {
        const foods = await Food.find()
        res.status(200).json({ success: true, foods })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})


// @Route PUT api/foods
// @desc Update food
// access Private
router.put("/:id", verifyToken, async (req, res) => {
    const { title, description, pictures, price } = req.body

    // Simple validation
    if (!title || !description || !pictures || !price) {
        res.status(400).json({ success: false, message: "Please fill out the form!" })
    }

    try {
        let updatedFood = { title, description, pictures, price }
        const foodUpdateCondition = { _id: req.params.id, user: req.userId }
        updatedFood = await Food.findByIdAndUpdate(foodUpdateCondition, updatedFood, { new: true })

        // User not authorised to update post
        if (!updatedFood) {
            res.status(401).json({ success: false, message: "Food not found or user not authorised" })
        }
        res.status(200).json({ success: true, message: "Updated successfully!", updatedFood })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

// @Route DELETE api/foods
// @desc Delete food
// access Private
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const foodDeleteCondition = { _id: req.params.id, user: req.userId }
        const deletedFood = await Food.findByIdAndDelete(foodDeleteCondition)

        // User not authorised or food not found
        if (!deletedFood) {
            res.status(401).json({ success: false, message: "Food not found or user not authorised" })
        }
        res.status(200).json({ success: true, message: "Deleted successfully!", food: deletedFood })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }
})

module.exports = router;