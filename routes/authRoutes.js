const express = require("express");
const router = express.Router();
const { register, login, verifyOTP } = require("../controllers/authController");

router.post("/register", register);
router.post("/verify-otp", verifyOTP); // Verifies OTP and finalizes registration
router.post("/login", login);

module.exports = router;
