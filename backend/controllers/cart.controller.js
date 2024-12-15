const Cart = require("../models/cart.model.js");
const Product = require("../models/productSchema.model.js");
const mongoose = require("mongoose");

// Fetch cart data
const getCart = async (req, res) => {
  try {
      const userId = req.user.userId;

      const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart retrieved successfully", cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Add or update a product in the cart
const addToCart = async (req, res) => {
    console.log("coming from addto cart controller")
  try {
    const { userId, productId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId format." });
    }

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "User ID, Product ID, and Quantity are required." });
    }

      const product = await Product.findById(productId);
      
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

      let cart = await Cart.findOne({ userId });
        console.log("cart foound", cart)
      
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
        console.log("cart foound after not finding", cart)
        
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart successfully.", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update quantity of a product in the cart
const updateCart = async (req, res) => {
  console.log("Coming from update cart quantity");

  try {
    const { productId, quantity } = req.body;

    // Ensure productId and quantity are provided
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    // Find the cart for the logged-in user
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (!existingItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

      existingItem.quantity = quantity;
      await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
      console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Remove a product from the cart
const removeFromCart = async (req, res) => {
    console.log("Coming from remove from cart");
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    res.status(200).json({ message: "Product removed successfully", cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
const deleteCart = async (req,res) => {
    
try {
    const userId = req.user.userId; 
    await Cart.findOneAndDelete({ userId });

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
}
}
    

module.exports = {
  getCart,
  addToCart,
  updateCart,
    removeFromCart,
  deleteCart
};
