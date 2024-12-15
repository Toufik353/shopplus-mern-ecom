const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js")
const { getCart,addToCart,updateCart,removeFromCart,deleteCart} = require("../controllers/cart.controller.js")
// Get cart for authenticated user
router.get('/cart', authMiddleware, getCart);

// Add item to cart for authenticated user
router.post('/cart', authMiddleware, addToCart);

// update the cart item for authenticated user
router.put('/cart', authMiddleware, updateCart);

// Delete cart for authenticated user
router.delete('/cart/clear', authMiddleware, deleteCart);

// Remove item from cart for authenticated user
router.delete('/cart', authMiddleware, removeFromCart);


module.exports = router;
