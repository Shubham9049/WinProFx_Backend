// routes/moneyplant.routes.js
const express = require("express");
const router = express.Router();
const {
  registerUserWithMoneyPlant,
  getAccountSummary,
} = require("../controllers/moneyplant.controller");

router.post("/register", registerUserWithMoneyPlant);
router.post("/checkBalance", getAccountSummary);

module.exports = router;
