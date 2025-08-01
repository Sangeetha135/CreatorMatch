const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getCampaigns,
  createCampaign,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  applyToCampaign,
  updateCampaignProgress,
  getCampaignUsers,
  updateCampaignStatus,
  getCompletedCampaigns,
  updateAllCampaignsProgress,
  checkAndUpdateCampaignProgress,
  handleInvitation,
  testRejectionNotification,
  recalculateCampaignStats,
} = require("../controllers/campaignController");
const {
  protect,
  isBrand,
  isInfluencer,
  isAdmin,
} = require("../middleware/authMiddleware");
const checkSuspension = require("../middleware/checkSuspension");

// Configure multer for campaign assets
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/campaigns");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create campaigns directory if it doesn't exist
const fs = require("fs");
const path = require("path");
const uploadsDir = path.join(__dirname, "../uploads/campaigns");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

router
  .route("/")
  .get(protect, checkSuspension, getCampaigns)
  .post(
    protect,
    checkSuspension,
    isBrand,
    upload.single("campaignAssets"),
    createCampaign
  );

// Add completed campaigns route BEFORE the dynamic ID routes
router.get("/completed", protect, checkSuspension, getCompletedCampaigns);

// Add route for updating all campaigns' progress
router
  .route("/update-all-progress")
  .post(protect, checkSuspension, isAdmin, updateAllCampaignsProgress);

router
  .route("/:id")
  .get(
    protect,
    checkSuspension,
    async (req, res, next) => {
      await checkAndUpdateCampaignProgress(req.params.id);
      next();
    },
    getCampaignById
  )
  .put(
    protect,
    checkSuspension,
    isBrand,
    async (req, res, next) => {
      await checkAndUpdateCampaignProgress(req.params.id);
      next();
    },
    updateCampaign
  )
  .delete(protect, checkSuspension, isBrand, deleteCampaign);

router.route("/:id/users").get(
  protect,
  checkSuspension,
  async (req, res, next) => {
    await checkAndUpdateCampaignProgress(req.params.id);
    next();
  },
  getCampaignUsers
);

router
  .route("/:id/apply")
  .post(protect, checkSuspension, isInfluencer, applyToCampaign);

// Add campaign progress update route
router
  .route("/:id/progress")
  .put(protect, checkSuspension, isBrand, updateCampaignProgress);

// @route   PUT /api/campaigns/:id/status
// @desc    Update campaign status and update influencer stats if completed
// @access  Private
router.put(
  "/:id/status",
  protect,
  checkSuspension,
  isBrand,
  async (req, res, next) => {
    await checkAndUpdateCampaignProgress(req.params.id);
    next();
  },
  updateCampaignStatus
);

// Test route for rejection notifications
router.post(
  "/test-rejection",
  protect,
  checkSuspension,
  testRejectionNotification
);

// @route   POST /api/campaigns/recalculate-stats
// @desc    Recalculate all campaign statistics for brands and influencers
// @access  Private
router.post(
  "/recalculate-stats",
  protect,
  checkSuspension,
  recalculateCampaignStats
);

module.exports = router;
