const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/User");

// @Route GET api/users
// @desc Get users
// access Private
router.get("/", verifyToken, async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({ success: true, users })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});


module.exports = router;
