import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import googleRoutes from "./routes/google.routes.js";
import passport from "./config/passport.js";
import paymentRoutes from "./routes/payment.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

const allowedOrigins = process.env.FRONTEND_URL
  ? [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL.replace("://", "://www."),
    ]
  : [];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use("/api/webhooks", webhookRoutes);
app.use(express.json());
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ status: "MeetYouLive API running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", googleRoutes);
app.use("/api/payments", paymentRoutes);

export default app;
