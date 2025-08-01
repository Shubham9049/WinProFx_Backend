const axios = require("axios");
const Account = require("../models/account.model");
const User = require("../models/User");

exports.registerUserWithMoneyPlant = async (req, res) => {
  const { email, curr, actype, Utype, Ref, Password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Call external API
    const { data } = await axios.post(
      "https://api.moneyplantfx.com/WSMoneyplant.aspx?type=SNDPReguser",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 3. If success, save account to MongoDB with user reference
    if (data.response === "success") {
      const newAccount = new Account({
        user: user._id, // ✅ associate with user
        accountNo: data.accountno,
        currency: curr,
        accountType: actype,
        userType: Utype,
        referralCode: Ref || "",
        moneyPlantPassword: Password,
      });

      await newAccount.save();

      res.status(200).json({
        message: "Account successfully created",
        accountNo: data.accountno,
      });
    } else {
      res.status(400).json({ message: data.message || "Registration failed" });
    }
  } catch (error) {
    console.error("MoneyPlant API error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
