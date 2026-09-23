import { Router } from "express";
import {
  createCheckoutSession,
  getBillingInfo,
} from "../controllers/billing.controller.js";
import { verifyJWT, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getBillingInfo);
router.post("/checkout", requireRole("admin"), createCheckoutSession);

export default router;