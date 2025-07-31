const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  requestPasswordReset,
  verifyAndResetPassword,

  getAllUsers,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/verify-otp", verifyOTP); // Verifies OTP and finalizes registration
router.post("/login", login);
router.post("/request-reset", requestPasswordReset);
router.post("/verify-reset-otp", verifyAndResetPassword);
router.get("/users", getAllUsers); // ⛔ secure with authMiddleware in production

module.exports = router;
