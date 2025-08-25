// route/paymentRoutes.js

const express = require("express");
const router = express.Router();
const { handlePaymentCallback } = require("../controllers/paymentController");

router.post("/callback", handlePaymentCallback);

let DIGIPAY_TOKEN = null;
let TOKEN_EXPIRY = null;
// Login function
async function digiPayLogin() {
  const res = await axios.post("https://digipay247.pgbackend.xyz/login", {
    username: process.env.DIGIPAY_USERNAME,
    password: process.env.DIGIPAY_PASSWORD,
  });

  DIGIPAY_TOKEN = res.data.data.token;
  TOKEN_EXPIRY = Date.now() + res.data.data.expires_in * 1000; // ms
  return DIGIPAY_TOKEN;
}

// Deposit endpoint
router.post("/deposit", async (req, res) => {
  try {
    const { amount, merchant_user_id } = req.body;

    // Ensure token valid
    if (!DIGIPAY_TOKEN || Date.now() > TOKEN_EXPIRY) {
      await digiPayLogin();
    }

    // Generate unique txn ID
    const merchant_txn_id = "TRXN" + Date.now();

    const response = await axios.post(
      "https://digipay247.pgbackend.xyz/payin/generate",
      {
        gateway_id: 3,
        amount,
        merchant_txn_id,
        merchant_user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${DIGIPAY_TOKEN}`,
        },
      }
    );

    return res.json({
      status: "SUCCESS",
      payment_url: response.data.data.url,
      transaction_id: response.data.data.transaction_id,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ status: "FAILED", error: err.message });
  }
});

module.exports = router;
