// route/paymentRoutes.js

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/callback", paymentController.handlePaymentCallback);

module.exports = router;
