const express = require("express");
const { getProductById, getAllProducts } = require("../controllers/product.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/products",(req, res) => getAllProducts(req, res));
router.get("/products/:id", (req, res) => getProductById(req, res));

module.exports = router;
