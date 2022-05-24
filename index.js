const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const cors = require("cors")

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const placeRouter = require("./routes/places");
const foodRouter = require("./routes/foods");
const hotelRouter = require("./routes/hotels");
const tourRouter = require("./routes/tours");

const app = express()
dotenv.config()

// CONNECT DATABASE
mongoose.connect(
    `mongodb+srv://vivucondao:nguyenthanhrin@vivu-condao.xcq7vun.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},
    () => {
        console.log("Connected to MongoDB");
    }
);

app.use(express.json())
app.use(cors())

// ROUTER
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/places', placeRouter)
app.use('/api/foods', foodRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/tours', tourRouter)

const port = process.env.PORT || 9000;

app.listen(port, () => console.log(`Server is running on port ${port}`));

