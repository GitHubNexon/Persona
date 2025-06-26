const express = require("express");
const router = express.Router();
const passport = require("../configs/passport");
const {
  authenticate,
  authenticateToken,
  unlockAccount,
  googleAuthSuccess,
  googleAuthFailure,
} = require("../controllers/authController");
const { checkBody, asyncHandler } = require("../helpers/helper");

// Login API
router.post(
  "/",
  asyncHandler(async (req, res) => {
    checkBody(["email", "password"], req, res);
    await authenticate(req, res);
  })
);

// Check Token API
router.post(
  "/check",
  authenticateToken,
  asyncHandler(async (req, res) => res.json(req.user))
);

// Logout API
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    res.clearCookie("hris_token");
    res.status(200).json({ message: "Logged out successfully" });
  })
);

router.post(
  "/unlock",
  authenticateToken, // Ensure the user is authenticated
  asyncHandler(async (req, res) => {
    checkBody(["email"], req, res); // Ensure email is provided in the request body
    await unlockAccount(req, res);
  })
);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/failure" }),
  googleAuthSuccess
);

router.get("/google/failure", googleAuthFailure);

module.exports = router;
