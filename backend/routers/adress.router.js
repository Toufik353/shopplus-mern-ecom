const express = require('express');
const router = express.Router();
const { addAddress, getAllAddresses } = require('../controllers/adress.controller.js');
const authMiddleware = require("../middleware/authMiddleware.js")
// Add Address
router.post('/addaddress', authMiddleware, addAddress);

router.get("/addaddress",authMiddleware,getAllAddresses)

module.exports = router;
