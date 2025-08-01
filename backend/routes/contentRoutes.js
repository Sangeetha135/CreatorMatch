const express = require("express");
const router = express.Router();
const {
  protect,
  isInfluencer,
  isBrand,
} = require("../middleware/authMiddleware");
const checkSuspension = require("../middleware/checkSuspension");
const {
  submitContent,
  getCampaignContent,
  reviewContent,
} = require("../controllers/contentController");

// Content submission routes
router.post("/submit", protect, checkSuspension, isInfluencer, submitContent);

// Route for getting all content for a campaign
router.get(
  "/campaign/:campaignId",
  protect,
  checkSuspension,
  getCampaignContent
);

// Route for reviewing content (brands only)
router.put(
  "/:contentId/review",
  protect,
  checkSuspension,
  isBrand,
  reviewContent
);

module.exports = router;
