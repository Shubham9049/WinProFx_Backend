const axios = require("axios");
const Account = require("../models/account.model");

exports.registerUserWithMoneyPlant = async (req, res) => {
  const { curr, actype, Utype, Ref, Password } = req.body;

  try {
    const { data } = await axios.post(
      "https://api.moneyplantfx.com/WSMoneyplant.aspx?type=SNDPReguser",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data.response === "success") {
      // Save account in MongoDB
      const newAccount = new Account({
        accountNo: data.accountno,
        currency: curr,
        accountType: actype,
        userType: Utype,
        referralCode: Ref || "",
        moneyPlantPassword: Password,
      });

      await newAccount.save();

      res.status(200).json({
        message: "Success",
        accountNo: data.accountno,
      });
    } else {
      res.status(400).json({ message: data.message || "Registration failed" });
    }
  } catch (error) {
    console.error("Axios MoneyPlant API error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
