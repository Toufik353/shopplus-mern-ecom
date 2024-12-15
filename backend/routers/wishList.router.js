const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const {getWishlist,addToWishlist,removeFromWishlist} = require("../controllers/wishList.controller.js")
const router = express.Router();

router.get("/wishlist", authMiddleware, getWishlist);
router.post("/wishlist", authMiddleware, addToWishlist);
router.delete("/wishlist", authMiddleware, removeFromWishlist);

module.exports = router;
