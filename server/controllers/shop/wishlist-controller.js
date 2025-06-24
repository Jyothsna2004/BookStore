const Wishlist = require("../../models/Wishlist");

// Get wishlist for a user
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.findOne({ userId }).populate("items.productId");
    res.json({ success: true, data: wishlist ? wishlist.items : [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [{ productId }] });
    } else {
      const exists = wishlist.items.some(item => item.productId.toString() === productId);
      if (!exists) {
        wishlist.items.push({ productId });
      }
    }
    await wishlist.save();
    res.json({ success: true, data: wishlist.items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
      await wishlist.save();
    }
    res.json({ success: true, data: wishlist ? wishlist.items : [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}; 