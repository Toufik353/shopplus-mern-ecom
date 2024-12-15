const express = require('express');
const {
  signup,
  login,
    getUserProfile,
    updateUserInfo,
    addAddress
} = require('../controllers/user.controller.js');

const authMiddleware = require("../middleware/authMiddleware.js")

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);


router.get('/profile', authMiddleware,getUserProfile);

// // User management routes
router.put('/profile', authMiddleware, updateUserInfo); 

router.post("/address",authMiddleware,addAddress)

module.exports = router;
