const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  pdfUrl: {
    type: String,
    default: null
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  content: {
    chapters: [{
      title: String,
      content: String,
      pageNumber: Number
    }],
    totalPages: {
      type: Number,
      default: 0
    }
  }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
