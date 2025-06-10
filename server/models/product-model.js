const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  // New fields for digital book
  isDigital: {
    type: Boolean,
    default: false
  },
  pdfUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product; 