const express = require("express");
const router = express.Router();
const { getCreators } = require("../controllers/creatorController");
const { protect } = require("../middleware/authMiddleware");
const checkSuspension = require("../middleware/checkSuspension");

// Get all creators
router.route("/").get(protect, checkSuspension, getCreators);

module.exports = router;
