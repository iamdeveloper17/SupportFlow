import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Message from "../models/Message.model.js";
import Ticket from "../models/Ticket.model.js";
import User from "../models/User.model.js";
import { queueEmail } from "../jobs/queue.js";

export const getMessages = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findOne({
    _id: req.params.ticketId,
    workspace: req.user.workspace,
  });

  if (!ticket) throw new ApiError(404, "Ticket not found");

  const filter = { ticket: ticket._id };
  if (req.user.role === "customer") filter.isInternalNote = false;

  const messages = await Message.find(filter)
    .populate("sender", "name email avatar role")
    .sort("createdAt");

  res.status(200).json(new ApiResponse(200, { messages }, "Messages fetched"));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, isInternalNote } = req.body;

  const ticket = await Ticket.findOne({
    _id: req.params.ticketId,
    workspace: req.user.workspace,
  });
  if (!ticket) throw new ApiError(404, "Ticket not found");

  if (req.user.role === "customer" && isInternalNote) {
    throw new ApiError(403, "Customers cannot send internal notes");
  }

  const message = await Message.create({
    ticket: ticket._id,
    workspace: req.user.workspace,
    sender: req.user._id,
    content,
    isInternalNote: isInternalNote || false,
  });

  if (!ticket.firstResponseAt && req.user.role !== "customer") {
    ticket.firstResponseAt = new Date();
    await ticket.save();
  }

  const populated = await message.populate("sender", "name email avatar role");

  const io = req.app.get("io") || global.io;
  if (io) {
    io.to(`ticket:${ticket._id}`).emit("message:new", populated);
  }

  // 🔥 Phase 5: Email notification to other party
  try {
    const recipientId =
      req.user.role === "customer" ? ticket.assignedTo : ticket.customer;

    if (recipientId && !isInternalNote) {
      const recipient = await User.findById(recipientId);
      if (recipient && recipient._id.toString() !== req.user._id.toString()) {
        queueEmail("new-message", {
          ticket,
          recipient,
          sender: req.user,
          preview: content,
        }).catch(console.error);
      }
    }
  } catch (err) {
    console.error("Notification error:", err.message);
  }

  res.status(201).json(new ApiResponse(201, { message: populated }, "Message sent"));
});

export const getAgents = asyncHandler(async (req, res) => {
  const agents = await User.find({
    workspace: req.user.workspace,
    role: { $in: ["admin", "agent"] },
  }).select("name email avatar role");

  res.status(200).json(new ApiResponse(200, { agents }, "Agents fetched"));
});