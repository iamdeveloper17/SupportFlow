import { Router } from "express";
import authRoutes from "./auth.routes.js";
import ticketRoutes from "./ticket.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);

export default router;