const express = require("express");
const { isAuthenticated } = require('../../middleware/auth-middleware');
const {
  addReview,
  updateReview,
  deleteReview,
  getProductReviews
} = require("../../controllers/shop/review-controller");

const router = express.Router();

// Get reviews for a product (public)
router.get('/product/:productId', getProductReviews);

// Protected routes (require authentication)
router.post('/add', isAuthenticated, addReview);
router.put('/update/:reviewId', isAuthenticated, updateReview);
router.delete('/delete/:reviewId', isAuthenticated, deleteReview);

module.exports = router;
