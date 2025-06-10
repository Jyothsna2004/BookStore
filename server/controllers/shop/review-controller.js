const Review = require('../../models/review-model');
const Product = require('../../models/product-model');

// Helper function to calculate and update product rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const avgRating = reviews.length > 0 
    ? Math.round((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length) * 10) / 10
    : 0;
  
  await Product.findByIdAndUpdate(productId, { rating: avgRating });
  return avgRating;
};

// Input validation helper
const validateReviewInput = (rating, comment) => {
  const errors = [];
  
  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    errors.push('Rating must be an integer between 1 and 5');
  }
  
  if (!comment || comment.trim().length < 10) {
    errors.push('Comment must be at least 10 characters long');
  }
  
  if (comment && comment.length > 500) {
    errors.push('Comment must be less than 500 characters');
  }
  
  return errors;
};

// Add a new review
const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id;

    // Validate input
    const validationErrors = validateReviewInput(rating, comment);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create new review
    const review = new Review({
      user: userId,
      product: productId,
      rating: parseInt(rating),
      comment: comment.trim()
    });

    await review.save();

    // Update product's average rating
    await updateProductRating(productId);

    // Populate user info for response
    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      review,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review'
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Validate input
    const validationErrors = validateReviewInput(rating, comment);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Find review and verify ownership
    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to update it'
      });
    }

    // Update review
    review.rating = parseInt(rating);
    review.comment = comment.trim();
    review.updatedAt = new Date();
    await review.save();

    // Update product's average rating
    await updateProductRating(review.product);

    // Populate user info for response
    await review.populate('user', 'name');

    res.json({
      success: true,
      review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review'
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    // Find review and verify ownership
    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to delete it'
      });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product's average rating
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review'
    });
  }
};

// Get reviews for a product with pagination
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ product: productId });
    const totalPages = Math.ceil(totalReviews / limit);

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview,
  getProductReviews
};