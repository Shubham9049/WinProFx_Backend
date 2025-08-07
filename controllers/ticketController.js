const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Message = require("../models/Reply");

// Create a new support ticket
exports.createTicket = async (req, res) => {
  try {
    const { email } = req.params;
    const { category, subject, description } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ticket = await Ticket.create({
      user: user._id,
      category,
      subject,
      description,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating ticket", error: err.message });
  }
};

// Get all tickets (admin)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("user", "fullName email");
    res.status(200).json(tickets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching tickets", error: err.message });
  }
};

// Get tickets by user email
exports.getUserTickets = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const tickets = await Ticket.find({ user: user._id });
    res.status(200).json(tickets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user tickets", error: err.message });
  }
};

// Get a ticket with messages
exports.getTicketWithMessages = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId).populate(
      "user",
      "fullName email"
    );

    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const messages = await Message.find({ ticket: ticketId }).sort({
      createdAt: 1,
    });

    res.status(200).json({ ticket, messages });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving ticket", error: err.message });
  }
};

// Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const updated = await Ticket.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Ticket not found" });

    res.status(200).json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating status", error: err.message });
  }
};

// Delete a ticket
exports.deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    await Message.deleteMany({ ticket: ticketId });
    await Ticket.findByIdAndDelete(ticketId);

    res.status(200).json({ message: "Ticket and messages deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting ticket", error: err.message });
  }
};

// Add a message to a ticket
exports.addMessageToTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { senderType, message } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const newMessage = await Message.create({
      ticket: ticketId,
      message,
      senderType,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding message", error: err.message });
  }
};

// Get all messages for a ticket
exports.getMessagesForTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const messages = await Message.find({ ticket: ticketId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: err.message });
  }
};
