const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const { addReviews, getProductReviews } = require("../controllers/review.controller.js");

const router = express.Router();

// Fetch reviews for a specific product
router.get("/reviews/:productId", getProductReviews);

// Add a review for a product
router.post("/reviews", authMiddleware, addReviews);

module.exports = router;
