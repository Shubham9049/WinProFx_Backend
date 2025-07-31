const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const sendWhatsAppOTP = require("../utils/sendWhatsAppOTP");

exports.register = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    nationality,
    state,
    city,
    password,
    referralCode,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    const user = new User({
      fullName,
      email,
      phone,
      nationality,
      state,
      city,
      password: hashedPassword,
      referralCode,
      otp,
      otpExpires,
    });

    await user.save();

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is <strong>${otp}</strong></p>`,
    });

    await sendWhatsAppOTP(phone, otp);

    res.status(200).json({ message: "OTP sent to email and WhatsApp" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otp || !user.otpExpires || new Date() > user.otpExpires)
      return res
        .status(400)
        .json({ message: "OTP expired. Please register again." });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // OTP matched – now activate
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "User verified & registered",
      token,
      user: user.fullName,
      user: user.email,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // 🚫 Block login if OTP is still pending
    if (user.otp) {
      return res.status(403).json({
        message: "Please verify your OTP before logging in.",
      });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your account via OTP." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
