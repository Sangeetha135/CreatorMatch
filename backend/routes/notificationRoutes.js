const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const checkSuspension = require("../middleware/checkSuspension");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createTestRejectionNotification,
} = require("../controllers/notificationController");

// Get all notifications for logged in user
router.get("/", protect, checkSuspension, getNotifications);

// Mark a notification as read
router.put("/:id/read", protect, checkSuspension, markAsRead);

// Mark all notifications as read
router.put("/read-all", protect, checkSuspension, markAllAsRead);

// Get unread notification count
router.get("/unread-count", protect, checkSuspension, getUnreadCount);

// Test route to create a rejection notification
router.post("/test-rejection", createTestRejectionNotification);

module.exports = router;
