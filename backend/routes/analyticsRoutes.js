const express = require("express");
const router = express.Router();
const { getYouTubeAnalytics } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");
const checkSuspension = require("../middleware/checkSuspension");

router.get("/youtube", protect, checkSuspension, getYouTubeAnalytics);

module.exports = router;
