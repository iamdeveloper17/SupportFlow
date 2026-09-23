import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String, default: "" },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    settings: {
      slaHours: { type: Number, default: 24 },
      autoAssign: { type: Boolean, default: false },
    },
    subscription: {
      stripeCustomerId: { type: String, default: null },
      stripeSubscriptionId: { type: String, default: null },
      status: { type: String, default: "active" },
      currentPeriodEnd: { type: Date, default: null },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Workspace", workspaceSchema);