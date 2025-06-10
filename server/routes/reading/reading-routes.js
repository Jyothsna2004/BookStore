const express = require("express");
const {
  getBookContent,
  getReadingProgress,
  updateReadingProgress,
  markBookCompleted
} = require("../../controllers/reading/reading-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Get book content
router.get("/content/:bookId", authMiddleware, getBookContent);

// Get reading progress
router.get("/progress/:bookId", authMiddleware, getReadingProgress);

// Update reading progress
router.post("/progress/:bookId", authMiddleware, updateReadingProgress);

// Mark book as completed
router.post("/complete/:bookId", authMiddleware, markBookCompleted);

module.exports = router; 