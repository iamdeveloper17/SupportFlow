import ApiError from "../utils/ApiError.js";
import Workspace from "../models/Workspace.model.js";
import User from "../models/User.model.js";
import Ticket from "../models/Ticket.model.js";

const PLAN_LIMITS = {
  free: { agents: 1, tickets: 100 },
  pro: { agents: 10, tickets: 5000 },
  enterprise: { agents: Infinity, tickets: Infinity },
};

export const checkAgentLimit = async (req, res, next) => {
  const workspace = await Workspace.findById(req.user.workspace);
  const limits = PLAN_LIMITS[workspace.plan];

  const agentCount = await User.countDocuments({
    workspace: workspace._id,
    role: { $in: ["admin", "agent"] },
  });

  if (agentCount >= limits.agents) {
    throw new ApiError(
      403,
      `Your ${workspace.plan} plan allows only ${limits.agents} agents. Upgrade to add more.`
    );
  }
  next();
};

export const checkTicketLimit = async (req, res, next) => {
  const workspace = await Workspace.findById(req.user.workspace);
  const limits = PLAN_LIMITS[workspace.plan];

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const count = await Ticket.countDocuments({
    workspace: workspace._id,
    createdAt: { $gte: startOfMonth },
  });

  if (count >= limits.tickets) {
    throw new ApiError(
      403,
      `Monthly ticket limit (${limits.tickets}) reached. Upgrade your plan.`
    );
  }
  next();
};