const express = require("express");
const dotenv = require("dotenv");
const { connect } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const moneyplantRoutes = require("./routes/moneyplant.routes");

dotenv.config();
connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/moneyplant", moneyplantRoutes); // then route becomes /api/moneyplant/register
app.use("/", (req, res) => {
  res.send("I ..I...AM ...IRONMAN🫰");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
