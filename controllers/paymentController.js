const Transaction = require("../models/Transaction");

exports.handlePaymentCallback = async (req, res) => {
  try {
    const transaction = req.body.transaction;

    if (!transaction || !transaction.id) {
      return res.status(400).json({ message: "Invalid transaction data" });
    }

    // Check for duplicate
    const existingTxn = await Transaction.findOne({
      transactionId: transaction.id,
    });

    if (existingTxn) {
      console.log("Duplicate callback ignored:", transaction.id);
      return res.status(200).json({ message: "Already processed" });
    }

    // Save new transaction
    const newTxn = new Transaction({
      transactionId: transaction.id,
      status: transaction.status,
      merchantTxnId: transaction.merchant_txn_id,
      userId: transaction.merchant_user_id,
      amount: transaction.amount,
      type: transaction.type,
      addedOn: transaction.added_on,
      refId: transaction.ref_id,
      gateway: transaction.gateway,
      merchant: transaction.merchant,
      wallet: transaction.wallet,
      currency: transaction.currency,
    });

    await newTxn.save();

    // TODO: Business logic like wallet crediting, notification, etc.

    return res.status(200).json({ message: "Callback processed successfully" });
  } catch (error) {
    console.error("Error in payment callback:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
