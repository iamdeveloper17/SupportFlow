import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { authLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getMe);

export default router;