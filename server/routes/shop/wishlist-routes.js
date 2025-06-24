const express = require("express");
const router = express.Router();
const wishlistController = require("../../controllers/shop/wishlist-controller");

// Get wishlist for a user
router.get("/:userId", wishlistController.getWishlist);
// Add product to wishlist
router.post("/add", wishlistController.addToWishlist);
// Remove product from wishlist
router.delete("/remove", wishlistController.removeFromWishlist);

module.exports = router; 