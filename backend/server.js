const express = require('express')
const connectDB = require('./db.js')
const cors = require("cors")
const dotenv = require("dotenv")
const { signup, login } = require('./controllers/user.controller.js')
const bcrypt = require("bcrypt")
const { createPayment } = require('./controllers/payment.controller.js')
dotenv.config()

const app = express()

app.use(express.json())


app.use(cors());


connectDB()

// to get the products

app.use("/", require("./routers/product.router.js"))

app.use("/signup", signup)

app.use("/login", login)

// to get user info
app.use("/", require("./routers/user.router.js"))

// to get the cart data
app.use("/",require("./routers/cart.router.js"))

// to get the whishlist
app.use("/", require("./routers/wishList.router.js"))

// to get the address
app.use("/", require("./routers/adress.router.js"))

// to get the payment
app.use("/", require("./routers/payment.router.js"))

// to get the reviews
app.use("/", require("./routers/review.router.js"))

// to get the orders
app.use("/",require("./routers/order.router.js"))

app.listen(5036, () => {
    console.log('Server is running on port 5036')
})

