const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const checkSuspension = require("../middleware/checkSuspension");
const {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCounts,
} = require("../controllers/messageController");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/messages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create messages directory if it doesn't exist
const fs = require("fs");
const uploadsDir = path.join(__dirname, "../uploads/messages");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
router.get("/conversations", protect, checkSuspension, getConversations);
router.get("/unread-counts", protect, checkSuspension, getUnreadCounts);
router.get("/:campaignId/:userId", protect, checkSuspension, getMessages);
router.post("/", protect, checkSuspension, upload.single("file"), sendMessage);

module.exports = router;
