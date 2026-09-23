import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  getTicketStats,
  getAnalytics,
} from "../controllers/ticket.controller.js";
import {
  getMessages,
  sendMessage,
  getAgents,
} from "../controllers/message.controller.js";
import { verifyJWT, requireRole } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { checkTicketLimit } from "../middlewares/planLimit.middleware.js";
import {
  createTicketSchema,
  updateTicketSchema,
} from "../validators/ticket.validator.js";

const router = Router();

router.use(verifyJWT);

router.get("/stats", getTicketStats);
router.get("/analytics", getAnalytics);
router.get("/agents", getAgents);

router
  .route("/")
  .post(checkTicketLimit, validate(createTicketSchema), createTicket)
  .get(getTickets);

router
  .route("/:id")
  .get(getTicket)
  .patch(requireRole("admin", "agent"), validate(updateTicketSchema), updateTicket)
  .delete(requireRole("admin"), deleteTicket);

router.get("/:ticketId/messages", getMessages);
router.post("/:ticketId/messages", sendMessage);

export default router;