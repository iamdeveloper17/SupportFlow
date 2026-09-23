import { Queue, Worker } from "bullmq";
import connection from "../config/redis.js";
import User from "../models/User.model.js";
import Ticket from "../models/Ticket.model.js";
import Workspace from "../models/Workspace.model.js";
import {
  sendTicketCreatedEmail,
  sendTicketAssignedEmail,
  sendNewMessageEmail,
  sendSLABreachEmail,
} from "../services/email.service.js";

export const emailQueue = new Queue("email", { connection });
export const slaQueue = new Queue("sla", { connection });

export const startWorkers = () => {
  // EMAIL WORKER
  new Worker(
    "email",
    async (job) => {
      const { type, payload } = job.data;

      try {
        if (type === "ticket-created") {
          await sendTicketCreatedEmail(payload.ticket, payload.customer);
        } else if (type === "ticket-assigned") {
          await sendTicketAssignedEmail(
            payload.ticket,
            payload.agent,
            payload.customer
          );
        } else if (type === "new-message") {
          await sendNewMessageEmail(
            payload.ticket,
            payload.recipient,
            payload.sender,
            payload.preview
          );
        }
      } catch (err) {
        console.error("Email worker error:", err.message);
        throw err;
      }
    },
    { connection, concurrency: 5 }
  );

  // SLA WORKER
  new Worker(
    "sla",
    async (job) => {
      const { ticketId } = job.data;
      try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return;
        if (["resolved", "closed"].includes(ticket.status)) return;

        const workspace = await Workspace.findById(ticket.workspace);
        if (!workspace) return;

        const admin = await User.findById(workspace.owner);
        if (admin) {
          await sendSLABreachEmail(ticket, admin);
        }

        ticket.tags = [...new Set([...(ticket.tags || []), "sla-breach"])];
        await ticket.save();

        const io = global.io;
        if (io) {
          io.to(`workspace:${workspace._id}`).emit("sla:breach", {
            ticketId: ticket._id,
            ticketNumber: ticket.ticketNumber,
          });
        }
      } catch (err) {
        console.error("SLA worker error:", err.message);
      }
    },
    { connection, concurrency: 2 }
  );

  console.log("✅ BullMQ workers started");
};

export const queueEmail = (type, payload) =>
  emailQueue.add(type, { type, payload }, { attempts: 3, backoff: 5000 });

export const scheduleSLA = (ticketId, deadline) => {
  const delay = new Date(deadline).getTime() - Date.now();
  if (delay <= 0) return;
  return slaQueue.add(
    "check-sla",
    { ticketId },
    { delay, jobId: `sla-${ticketId}`, removeOnComplete: true }
  );
};