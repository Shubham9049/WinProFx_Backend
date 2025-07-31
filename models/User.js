const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  nationality: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  referralCode: { type: String },

  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  isVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: null },
  resetOtpExpires: { type: Date, default: null },
});

module.exports = mongoose.model("User", userSchema);
