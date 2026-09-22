import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["open", "pending", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    category: {
      type: String,
      enum: ["billing", "technical", "general", "other"],
      default: "general",
    },
    tags: [String],
    slaDeadline: Date,
    firstResponseAt: Date,
    resolvedAt: Date,
  },
  { timestamps: true }
);

ticketSchema.index({ workspace: 1, status: 1 });
ticketSchema.index({ workspace: 1, assignedTo: 1 });
ticketSchema.index({ ticketNumber: 1, workspace: 1 }, { unique: true });

export default mongoose.model("Ticket", ticketSchema);