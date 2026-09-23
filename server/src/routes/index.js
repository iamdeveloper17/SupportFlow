import { Router } from "express";
import authRoutes from "./auth.routes.js";
import ticketRoutes from "./ticket.routes.js";
import billingRoutes from "./billing.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/tickets", ticketRoutes);
router.use("/billing", billingRoutes);
router.use("/upload", uploadRoutes);

export default router;