const Product = require("../../models/Product");
const { ReadingProgress } = require("../../models/BookContent");

// Get book content
const getBookContent = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Product.findById(bookId);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    res.status(200).json({
      success: true,
      content: book.content
    });
  } catch (error) {
    console.error("Error fetching book content:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching book content"
    });
  }
};

// Get reading progress
const getReadingProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    let progress = await ReadingProgress.findOne({ userId, bookId });
    
    if (!progress) {
      // Create new progress if none exists
      progress = await ReadingProgress.create({
        userId,
        bookId,
        currentPage: 1,
        lastReadChapter: 1,
        readingTime: 0,
        completed: false
      });
    }

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    console.error("Error fetching reading progress:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reading progress"
    });
  }
};

// Update reading progress
const updateReadingProgress = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;
    const { currentPage, lastReadChapter, readingTime } = req.body;

    let progress = await ReadingProgress.findOne({ userId, bookId });
    
    if (!progress) {
      progress = await ReadingProgress.create({
        userId,
        bookId,
        currentPage,
        lastReadChapter,
        readingTime,
        completed: false
      });
    } else {
      progress.currentPage = currentPage;
      progress.lastReadChapter = lastReadChapter;
      progress.readingTime = readingTime;
      await progress.save();
    }

    res.status(200).json({
      success: true,
      progress
    });
  } catch (error) {
    console.error("Error updating reading progress:", error);
    res.status(500).json({
      success: false,
      message: "Error updating reading progress"
    });
  }
};

// Mark book as completed
const markBookCompleted = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const progress = await ReadingProgress.findOne({ userId, bookId });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Reading progress not found"
      });
    }

    progress.completed = true;
    await progress.save();

    res.status(200).json({
      success: true,
      message: "Book marked as completed"
    });
  } catch (error) {
    console.error("Error marking book as completed:", error);
    res.status(500).json({
      success: false,
      message: "Error marking book as completed"
    });
  }
};

module.exports = {
  getBookContent,
  getReadingProgress,
  updateReadingProgress,
  markBookCompleted
}; 