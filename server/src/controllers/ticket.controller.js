import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Ticket from "../models/Ticket.model.js";
import User from "../models/User.model.js";
import Workspace from "../models/Workspace.model.js";
import Message from "../models/Message.model.js";

// Generate ticket number per workspace
const generateTicketNumber = async (workspaceId) => {
  const count = await Ticket.countDocuments({ workspace: workspaceId });
  return `TKT-${String(count + 1).padStart(4, "0")}`;
};

// CREATE
export const createTicket = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspace;
  const { subject, description, priority, category, tags } = req.body;

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  const ticketNumber = await generateTicketNumber(workspaceId);
  const slaDeadline = new Date(
    Date.now() + workspace.settings.slaHours * 60 * 60 * 1000
  );

  const ticket = await Ticket.create({
    ticketNumber,
    subject,
    description,
    workspace: workspaceId,
    customer: req.user._id,
    priority,
    category,
    tags,
    slaDeadline,
  });

  // initial message = description
  await Message.create({
    ticket: ticket._id,
    workspace: workspaceId,
    sender: req.user._id,
    content: description,
  });

  res.status(201).json(new ApiResponse(201, { ticket }, "Ticket created"));
});

// LIST (role-aware)
export const getTickets = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspace;
  const { status, priority, assignedTo, search, page = 1, limit = 20 } = req.query;

  const query = { workspace: workspaceId };

  if (req.user.role === "customer") {
    query.customer = req.user._id;
  } else if (req.user.role === "agent") {
    query.$or = [{ assignedTo: req.user._id }, { assignedTo: null }];
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (assignedTo) query.assignedTo = assignedTo;
  if (search) query.subject = { $regex: search, $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .populate("customer", "name email avatar")
      .populate("assignedTo", "name email avatar")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Ticket.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        tickets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
      "Tickets fetched"
    )
  );
});

// GET ONE
export const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findOne({
    _id: req.params.id,
    workspace: req.user.workspace,
  })
    .populate("customer", "name email avatar")
    .populate("assignedTo", "name email avatar");

  if (!ticket) throw new ApiError(404, "Ticket not found");

  if (
    req.user.role === "customer" &&
    ticket.customer._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "Access denied");
  }

  res.status(200).json(new ApiResponse(200, { ticket }, "Ticket fetched"));
});

// UPDATE
export const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findOne({
    _id: req.params.id,
    workspace: req.user.workspace,
  });

  if (!ticket) throw new ApiError(404, "Ticket not found");

  if (req.user.role === "customer") {
    throw new ApiError(403, "Customers cannot update tickets");
  }

  const { status, priority, assignedTo, tags } = req.body;

  if (status) {
    ticket.status = status;
    if (status === "resolved" && !ticket.resolvedAt) {
      ticket.resolvedAt = new Date();
    }
  }
  if (priority) ticket.priority = priority;
  if (assignedTo !== undefined) ticket.assignedTo = assignedTo || null;
  if (tags) ticket.tags = tags;

  await ticket.save();

  const updated = await Ticket.findById(ticket._id)
    .populate("customer", "name email avatar")
    .populate("assignedTo", "name email avatar");

  res.status(200).json(new ApiResponse(200, { ticket: updated }, "Ticket updated"));
});

// DELETE
export const deleteTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findOneAndDelete({
    _id: req.params.id,
    workspace: req.user.workspace,
  });

  if (!ticket) throw new ApiError(404, "Ticket not found");

  await Message.deleteMany({ ticket: ticket._id });

  res.status(200).json(new ApiResponse(200, {}, "Ticket deleted"));
});

// STATS (for dashboard)
export const getTicketStats = asyncHandler(async (req, res) => {
  const workspaceId = req.user.workspace;

  const stats = await Ticket.aggregate([
    { $match: { workspace: workspaceId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const priorityStats = await Ticket.aggregate([
    { $match: { workspace: workspaceId } },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json(
    new ApiResponse(200, { byStatus: stats, byPriority: priorityStats }, "Stats fetched")
  );
});