const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { isAdmin } = require("../../middleware/auth-middleware");

const {
  handleImageUpload,
  handlePDFUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pdfDir = path.join(__dirname, "../../public/pdfs");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    cb(null, pdfDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadPDF = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// PDF upload route
router.post(
  "/upload-pdf",
  uploadPDF.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No PDF file uploaded",
        });
      }

      const pdfUrl = `/pdfs/${req.file.filename}`;
      res.json({
        success: true,
        pdfUrl,
        message: "PDF uploaded successfully",
      });
    } catch (error) {
      console.error("PDF upload error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading PDF",
      });
    }
  }
);

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
