import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import ApiError from "./utils/ApiError.js";
import { handleWebhook } from "./controllers/billing.controller.js";

const app = express();

// Trust proxy (Render/Vercel ke liye)
app.set("trust proxy", 1);

// ─── CORS — FIRST middleware, sabse pehle ───
const corsOptions = {
  origin: true, // reflect request origin (dev-friendly)
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS to ALL routes including OPTIONS preflight
app.use(cors(corsOptions));

// ─── Helmet (CORS ke baad, aur crossOriginResourcePolicy off) ───
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// ─── Stripe webhook MUST come BEFORE express.json() ───
app.post(
  "/api/v1/billing/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

// ─── Body parsers ───
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// ─── Rate limiter (OPTIONS skip karo) ───
app.use("/api", (req, res, next) => {
  if (req.method === "OPTIONS") return next();
  return apiLimiter(req, res, next);
});

// ─── Health check ───
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date(),
    env: process.env.NODE_ENV,
    clientUrl: process.env.CLIENT_URL,
  });
});

// ─── API Routes ───
app.use("/api/v1", routes);

// ─── 404 handler ───
app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

// ─── Error handler ───
app.use(errorHandler);

export default app;