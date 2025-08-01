const checkSuspension = (req, res, next) => {
  try {
    // Check if user is suspended
    if (req.user && req.user.suspendedAt) {
      return res.status(403).json({
        message: "Your account has been suspended",
        suspendedAt: req.user.suspendedAt,
        suspensionReason: req.user.suspensionReason || "No reason provided",
        isAccessRestricted: true,
      });
    }

    // Check if user is banned
    if (req.user && req.user.bannedAt) {
      return res.status(403).json({
        message: "Your account has been permanently banned",
        bannedAt: req.user.bannedAt,
        banReason: req.user.banReason || "No reason provided",
        isAccessRestricted: true,
      });
    }

    next();
  } catch (error) {
    console.error("Check suspension middleware error:", error);
    res.status(500).json({ message: "Error checking account status" });
  }
};

module.exports = checkSuspension;
