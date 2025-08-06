const express = require("express");
const router = express.Router();
const {
  createTicket,
  getUserTickets,
  getTicketWithReplies,
  addReply,
  updateTicketStatus,
} = require("../controllers/ticketController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTicket);
router.get("/", authMiddleware, getUserTickets);
router.get("/:id", authMiddleware, getTicketWithReplies);
router.post("/:id/reply", authMiddleware, addReply);
router.patch("/:id/status", authMiddleware, updateTicketStatus); // optional: restrict to admins

module.exports = router;
