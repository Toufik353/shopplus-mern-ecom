const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
        unique: true,
        trim: true,
  },
  price: {
    type: Number,
    required: true,
      min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
      enum: ['Electronics', 'Wearables', 'Computers', 'Appliances', 'Gaming'],
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
      default: 0,
      min: 0,
  },
  rating: {
    type: Number,
    min: 0,
      max: 5,
    default: 0,
  },
  createdAt: {
    type: Date,
      default: Date.now,
  },
  updatedAt: {
    type: Date,
      default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
