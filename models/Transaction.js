const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true }, // maps to "id"
    status: String, // "completed", "failed", etc.
    merchantTxnId: String, // "merchant_txn_id"
    userId: String, // "merchant_user_id"
    amount: String, // in "500.00"
    type: String, // "deposit" or "withdraw"
    addedOn: String, // timestamp
    refId: String, // "ref_id"
    gateway: Number, // 1, 2, etc.
    merchant: Number, // merchant ID
    wallet: Number, // wallet ID
    currency: String, // usually "INR"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
