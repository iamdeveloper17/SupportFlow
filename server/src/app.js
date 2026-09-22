import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import ApiError from "./utils/ApiError.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api", apiLimiter);

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

app.use("/api/v1", routes);

// 404
app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use(errorHandler);

export default app;