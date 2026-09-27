import express, { Application, Request, Response } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorHandler } from "./middlewares/errorHandler";

// Routes
import authRoutes from "./routes/authRoutes";
import donorRoutes from "./routes/donorRoutes";
import requestRoutes from "./routes/requestRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import adminRoutes from "./routes/adminRoutes";
import superAdminRoutes from "./routes/superAdminRoutes";

const app: Application = express();

/*
 * Trust the first proxy in production.
 *
 * This is important when BloodLink is deployed behind a reverse proxy.
 */
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security & parsing middlewares
app.use(helmet());

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,

  max: Number(process.env.RATE_LIMIT_MAX) || 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
    details: {},
  },
});

const authLimiter = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,

  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
    details: {},
  },
});

// API version
const API_VERSION = process.env.API_VERSION || "v1";

/*
 * Authentication routes use their own stricter limiter.
 *
 * They are mounted before the general limiter so authentication
 * requests are not counted against both limiters.
 */
app.use(`/api/${API_VERSION}/auth`, authLimiter, authRoutes);

/*
 * General rate limiting applies to the remaining application
 * routes and the health endpoint.
 */
app.use(generalLimiter);

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "BloodLink API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API routes

app.use(`/api/${API_VERSION}/donors`, donorRoutes);

app.use(`/api/${API_VERSION}/requests`, requestRoutes);

app.use(`/api/${API_VERSION}/inventory`, inventoryRoutes);

app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);

app.use(`/api/${API_VERSION}/admin`, adminRoutes);

app.use(`/api/${API_VERSION}/super-admin`, superAdminRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    code: "NOT_FOUND",
    details: {},
  });
});

// Global error handler
app.use(errorHandler);

export default app;
