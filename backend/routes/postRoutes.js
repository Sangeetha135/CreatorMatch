const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const checkSuspension = require("../middleware/checkSuspension");
const {
  createPost,
  getAllPosts,
  toggleLike,
} = require("../controllers/postController");

// Protected routes
router.post("/", protect, checkSuspension, createPost);
router.get("/", protect, checkSuspension, getAllPosts);
router.put("/:id/like", protect, checkSuspension, toggleLike);

module.exports = router;
