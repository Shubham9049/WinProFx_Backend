// routes/moneyplant.routes.js
const express = require("express");
const router = express.Router();
const {
  registerUserWithMoneyPlant,
  getAccountSummary,
  updatePassword,
} = require("../controllers/moneyplant.controller");

router.post("/register", registerUserWithMoneyPlant);
router.post("/checkBalance", getAccountSummary);
router.post("/updatePassword", updatePassword);

module.exports = router;
