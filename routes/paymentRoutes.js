// route/paymentRoutes.js

const express = require("express");
const router = express.Router();
const { handlePaymentCallback } = require("../controllers/paymentController");

router.post("/callback", handlePaymentCallback);

module.exports = router;
