const Wishlist = require("../models/wishlist.model.js");
const Product = require("../models/productSchema.model.js");

// Add a product to the wishlist
exports.addToWishlist = async (req, res) => {
        console.log("testing add to wishlist")

    const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: "User ID and Product ID are required" });
  }
    console.log("testing add to wishlist",userId,productId)

  try {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [] });
    }

    const productExists = wishlist.products.some(
      (item) => item.productId.toString() === productId
    );
    if (productExists) {
      return res.status(400).json({ message: "Product is already in your wishlist" });
    }

    wishlist.products.push({ productId });
    await wishlist.save();

      console.log("wishlist",wishlist)
    return res.status(200).json({
      message: "Product added to wishlist successfully",
      wishlist,
    });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Get the wishlist for a user
exports.getWishlist = async (req, res) => {
    const userId = req.user.userId;

  try {
    const wishlist = await Wishlist.findOne({ userId }).populate("products.productId");

    if (!wishlist || wishlist.products.length === 0) {
      return res.status(404).json({ message: "Wishlist is empty" });
    }

    return res.status(200).json({
      wishlist: wishlist.products,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Remove a product from the wishlist
exports.removeFromWishlist = async (req, res) => {
    console.log("coming from removeFrom wishlist")
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

      const wishlist = await Wishlist.findOne({ userId: req.user.userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.productId.toString() !== productId
    );
    await wishlist.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

