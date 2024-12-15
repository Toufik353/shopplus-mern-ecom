const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js")
const {createPayment} = require("../controllers/payment.controller.js")

router.post("/create-payment-intent",authMiddleware, createPayment);

module.exports = router;


