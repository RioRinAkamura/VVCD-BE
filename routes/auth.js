const express = require("express")
const router = express.Router()
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
const verifyToken = require("../middleware/verifyToken")

const User = require("../models/User")

// @Route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
    const { username, password } = req.body

    // Validation
    if (!username || !password) {
        res.status(400).json({ succes: false, message: "Missing username and/or password!" })
    }

    try {
        // Check for existing user
        const user = await User.findOne({ username })
        if (user) {
            res.status(400).json({ success: false, message: "Username already exist " })
        }

        // All good
        const hashsedPassword = await argon2.hash(password)
        const newUser = new User({
            username, password: hashsedPassword
        })
        await newUser.save()

        // Return token
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({ success: true, message: "User created succesfully!", accessToken })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

// @Route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
    const { username, password } = req.body

    // Validation
    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Missing username and/or password!" })
    }

    try {
        // Check for existing user
        const user = await User.findOne({ username })
        if (!user) {
            res.status(400).json({ success: false, message: "Incorect username or password" })
        }

        // Username found
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid) {
            res.status(400).json({ success: false, message: "Incorect username or password" })
        }

        // All good
        // Return token
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)
        res.status(200).json({ success: true, message: "Logged in successfully!", accessToken })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal server error!" })
    }

})

// @Route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get("/", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if (!user) {
            res.status(400).json({ success: false, message: "User not found" })
        }
        res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})









module.exports = router