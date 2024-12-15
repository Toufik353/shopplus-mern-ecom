const express = require("express");
const router = express.Router();
const Review = require("../models/review.model.js");

// Submit a review for a product
const addReviews = async (req, res) => {
    console.log("testing add review")
    const { productId, rating, review } = req.body;
    const userId = req.user.userId;
    console.log("req.user", req.user)
    console.log("req.body",req.body)
  if (!productId || !rating || !review) {
    return res.status(400).json({ message: "Product ID, rating, and review are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const newReview = new Review({
      userId,
      productId,
      rating,
      review,
    });

    // Save review to database
      await newReview.save();
      console.log("new review",newReview)
    res.status(201).json({ message: "Review submitted successfully!", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Error submitting review", error });
  }
};

// Get reviews for a product

const getProductReviews = async (req, res) => {
    const { productId } = req.params;
    console.log("prdoct id testing",req.params)

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    const reviews = await Review.find({ productId });
    if (reviews.length === 0) {
      return res.status(200).json({ message: "No reviews found for this product" });
    }
      console.log("reviews testing",reviews)
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};




module.exports = {addReviews,getProductReviews}
