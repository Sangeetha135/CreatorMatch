const express = require("express");
const router = express.Router();
const {
  createInvitation,
  getInvitations,
  getInvitationById,
  updateInvitation,
  respondToInvitation,
} = require("../controllers/invitationController");
const { protect, isBrand } = require("../middleware/authMiddleware");
const checkSuspension = require("../middleware/checkSuspension");

// Routes for invitations
router
  .route("/")
  .post(protect, checkSuspension, isBrand, createInvitation)
  .get(protect, checkSuspension, getInvitations);

router
  .route("/:id")
  .get(protect, checkSuspension, getInvitationById)
  .put(protect, checkSuspension, updateInvitation);

// Route for influencers to respond to invitations
router
  .route("/:invitationId/respond")
  .post(protect, checkSuspension, respondToInvitation);

module.exports = router;
