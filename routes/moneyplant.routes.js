// routes/moneyplant.routes.js
const express = require("express");
const router = express.Router();
const {
  registerUserWithMoneyPlant,
} = require("../controllers/moneyplant.controller");

router.post("/register", registerUserWithMoneyPlant);

module.exports = router;
