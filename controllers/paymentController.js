const axios = require("axios");
const Transaction = require("../models/Transaction");

exports.handlePaymentCallback = async (req, res) => {
  try {
    // console.log("Callback received:", req.body);

    // 1. Save transaction first
    const transaction = new Transaction({
      transactionId: req.body.id,
      status: req.body.status,
      merchantTxnId: req.body.merchant_txn_id,
      merchantUserId: req.body.merchant_user_id,
      amount: Number(req.body.amount),
      type: req.body.type,
      addedOn: new Date(req.body.added_on),
      refId: req.body.ref_id,
      gateway: req.body.gateway ? Number(req.body.gateway) : null,
      merchant: req.body.merchant ? Number(req.body.merchant) : null,
      wallet: req.body.wallet ? Number(req.body.wallet) : null,
      currency: req.body.currency || "INR",
      transactionPayinRequests: Array.isArray(
        req.body.transaction_payin_requests
      )
        ? req.body.transaction_payin_requests
        : [],
    });

    await transaction.save();

    // 2. If payment is completed, call MoneyPlant AddBalance API
    if (req.body.status === "completed") {
      const accountno = req.body.merchant_user_id; // assuming this maps to trading accountno
      const amount = req.body.amount;
      const orderid = "ORD" + Date.now().toString().slice(-12); // unique <=16 char

      try {
        const mpResponse = await axios.post(
          "https://api.moneyplantfx.com/WSMoneyplant.aspx?type=SNDPAddBalance",
          {
            accountno,
            amount,
            orderid,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // console.log("MoneyPlant AddBalance Response:", mpResponse.data);

        return res.status(200).json({
          success: true,
          message: "Transaction saved and balance updated",
          moneyplant: mpResponse.data,
        });
      } catch (err) {
        console.error("MoneyPlant AddBalance error:", err.message);
        return res.status(500).json({
          success: false,
          message: "Transaction saved but balance update failed",
          error: err.message,
        });
      }
    }

    // 3. If payment not completed
    return res.status(200).send({
      success: true,
      message: "Transaction saved but payment not completed",
    });
  } catch (error) {
    console.error("Error in callback:", error);
    res.status(500).send({ success: false, error: error.message });
  }
};
