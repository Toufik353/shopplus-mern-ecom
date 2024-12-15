const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/order.controller.js');
const authMiddleware = require('../middleware/authMiddleware.js');

// Route to create a new order
// router.post('/confirmation', authMiddleware, createOrder);

// Route to get all orders (you can add authentication here as well)
router.get('/order-history', authMiddleware, getOrders);

module.exports = router;
