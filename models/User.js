const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    accountType: {
      type: String,
      enum: ["Individual", "Corporate"],
      default: "Individual",
    },
    nationality: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    profileImage: { type: String }, // Path or URL

    password: { type: String, required: true },
    referralCode: { type: String },

    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: null },
    resetOtpExpires: { type: Date, default: null },

    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String }, // Optional depending on country
    iban: { type: String },
    bankName: { type: String, required: true },
    bankAddress: { type: String },

    identityFront: { type: String, required: true }, // File path or URL
    identityBack: { type: String, required: true },
    addressProof: { type: String, required: true },
    selfieProof: { type: String, required: true },
  },
  { timestamps: true }
);

// Virtual field to link to Account model
userSchema.virtual("accounts", {
  ref: "Account",
  localField: "_id",
  foreignField: "user",
});

// Ensure virtuals are included
userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
