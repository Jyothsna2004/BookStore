const mongoose = require("mongoose");

const bookContentSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  chapters: [{
    title: String,
    content: String,
    pageNumber: Number
  }],
  totalPages: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const readingProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  currentPage: {
    type: Number,
    default: 1
  },
  lastReadChapter: {
    type: Number,
    default: 1
  },
  readingTime: {
    type: Number,
    default: 0 // in minutes
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const BookContent = mongoose.model("BookContent", bookContentSchema);
const ReadingProgress = mongoose.model("ReadingProgress", readingProgressSchema);

module.exports = { BookContent, ReadingProgress }; 