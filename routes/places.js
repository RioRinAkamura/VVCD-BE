const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken")

const Place = require("../models/Place");

// @Route POST api/places
// @desc Create place
// access Private
router.post("/", verifyToken, async (req, res) => {
    const { title, description, pictures, distance, type } = req.body

    // validation
    if (!title || !description || !pictures || !distance || !type) {
        res.status(400).json({ success: false, message: "Please fill out the form!" })
    }

    try {
        const newPlace = new Place({
            title, description, pictures, distance, type
        })
        await newPlace.save();
        res.status(200).json({ success: true, message: "Created new place successfully!", place: newPlace })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

// @Route GET api/places
// @desc Get places
// access Private
router.get("/", verifyToken, async (req, res) => {
    try {
        const places = await Place.find()
        res.status(200).json({ success: true, places })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})


// @Route PUT api/places
// @desc Update place
// access Private
router.put("/:id", verifyToken, async (req, res) => {
    const { title, description, pictures, distance, type } = req.body

    // Simple validation
    if (!title || !description || !pictures || !distance || !type) {
        res.status(400).json({ success: false, message: "Please fill out the form!" })
    }

    try {
        let updatedPlace = { title, description, pictures, distance, type }
        const placeUpdateCondition = { _id: req.params.id, user: req.userId }
        updatedPlace = await Place.findByIdAndUpdate(placeUpdateCondition, updatedPlace, { new: true })

        // User not authorised to update post
        if (!updatedPlace) {
            res.status(401).json({ success: false, message: "Place not found or user not authorised" })
        }
        res.status(200).json({ success: true, message: "Updated successfully!", updatedPlace })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

// @Route DELETE api/places
// @desc Delete place
// access Private
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const placeDeleteCondition = { _id: req.params.id, user: req.userId }
        const deletedPlace = await Place.findByIdAndDelete(placeDeleteCondition)

        // User not authorised or place not found
        if (!deletedPlace) {
            res.status(401).json({ success: false, message: "Place not found or user not authorised" })
        }
        res.status(200).json({ success: true, message: "Deleted successfully!", place: deletedPlace })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }
})

module.exports = router;