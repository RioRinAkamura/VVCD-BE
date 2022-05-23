const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken")

const Hotel = require("../models/Hotel");

// @Route POST api/hotels
// @desc Create hotel
// access Private
router.post("/", verifyToken, async (req, res) => {
    const { name, address, pictures, rate, price } = req.body

    // validation
    if (!name || !address || !pictures || !price) {
        res.status(400).json({ success: false, message: "Please fill out the form!" })
    }

    try {
        const newHotel = new Hotel({
            name, address, pictures, rate, price
        })
        await newHotel.save();
        res.status(200).json({ success: true, message: "Created new hotel successfully!", hotel: newHotel })

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

// @Route GET api/hotels
// @desc Get hotels
// access Private
router.get("/", verifyToken, async (req, res) => {
    try {
        const hotels = await Hotel.find()
        res.status(200).json({ success: true, hotels })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})


// @Route PUT api/hotels
// @desc Update hotel
// access Private
router.put("/:id", verifyToken, async (req, res) => {
    const { name, address, pictures, rate, price } = req.body

    // Simple validation
    if (!name || !address || !pictures || !price) {
        res.status(400).json({ success: false, message: "Please fill out the form!" })
    }

    try {
        let updatedHotel = { name, address, pictures, rate, price }
        const hotelUpdateCondition = { _id: req.params.id, user: req.userId }
        updatedHotel = await Hotel.findByIdAndUpdate(hotelUpdateCondition, updatedHotel, { new: true })

        // User not authorised to update post
        if (!updatedHotel) {
            res.status(401).json({ success: false, message: "Hotel not found or user not authorised" })
        }
        res.status(200).json({ success: true, message: "Updated successfully!", updatedHotel })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

// @Route DELETE api/hotels
// @desc Delete hotel
// access Private
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const hotelDeleteCondition = { _id: req.params.id, user: req.userId }
        const deletedHotel = await Hotel.findByIdAndDelete(hotelDeleteCondition)

        // User not authorised or hotel not found
        if (!deletedHotel) {
            res.status(401).json({ success: false, message: "Hotel not found or user not authorised" })
        }
        res.status(200).json({ success: true, message: "Deleted successfully!", hotel: deletedHotel })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })

    }
})

module.exports = router;