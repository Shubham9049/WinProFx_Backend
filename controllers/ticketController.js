const Ticket = require("../models/Ticket");
const Reply = require("../models/Reply");

exports.createTicket = async (req, res) => {
  try {
    const { subject, description } = req.body;

    const ticket = await Ticket.create({
      user: req.user.id, // Is this undefined?
      subject,
      description,
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTicketWithReplies = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    const replies = await Reply.find({ ticket: req.params.id }).populate(
      "user",
      "email"
    );

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    res.json({ ticket, replies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await Reply.create({
      ticket: req.params.id,
      user: req.user.id,
      message,
    });

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
