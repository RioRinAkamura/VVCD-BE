const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken")

const Tour = require("../models/Tour");

// @Route POST api/tours
// @desc Create tour
// access Private
router.post("/", verifyToken, async (req, res) => {
    const { name, description, address, pictures, price } = req.body

    // validation
    if (!name || !description || !address || !pictures || !price) {
        res.status(400).json({ success: false, message: "Please fill out the form!" })
    }

    try {
        const newTour = new Tour({
            name, description, address, pictures, price
        })
        await newTour.save();
        res.status(200).json({ success: true, message: "Created new tour successfully!", tour: newTour })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

// @Route GET api/tours
// @desc Get tours
// access Private
router.get("/", verifyToken, async (req, res) => {
    try {
        const tours = await Tour.find()
        res.status(200).json({ success: true, tours })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})


// @Route PUT api/tours
// @desc Update tour
// access Private
router.put("/:id", verifyToken, async (req, res) => {
    const { name, description, address, pictures, price } = req.body

    // Simple validation
    if (!name || !description || !address || !pictures || !price) {
        res.status(400).json({ success: false, message: "Please fill out the form!" })
    }

    try {
        let updatedTour = { name, description, address, pictures, price }
        const tourUpdateCondition = { _id: req.params.id, user: req.userId }
        updatedTour = await Tour.findByIdAndUpdate(tourUpdateCondition, updatedTour, { new: true })

        // User not authorised to update post
        if (!updatedTour) {
            res.status(401).json({ success: false, message: "Tour not found or user not authorised" })
        }
        res.status(200).json({ success: true, message: "Updated successfully!", updatedTour })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

// @Route DELETE api/tours
// @desc Delete tour
// access Private
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const tourDeleteCondition = { _id: req.params.id, user: req.userId }
        const deletedTour = await Tour.findByIdAndDelete(tourDeleteCondition)

        // User not authorised or tour not found
        if (!deletedTour) {
            res.status(401).json({ success: false, message: "Tour not found or user not authorised" })
        }
        res.status(200).json({ success: true, message: "Deleted successfully!", tour: deletedTour })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }
})

module.exports = router;