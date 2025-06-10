const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be an integer'
    }
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters long'],
    maxlength: [500, 'Comment must be less than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
reviewSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date();
  }
  next();
});

// Ensure a user can only review a product once
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Index for efficient querying
reviewSchema.index({ product: 1, createdAt: -1 });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = Review;