import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import googleRoutes from "./routes/google.routes.js";
import passport from "./config/passport.js";
import paymentRoutes from "./routes/payment.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import liveRoutes from "./routes/live.routes.js";
import giftRoutes from "./routes/gift.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import moderationRoutes from "./routes/moderation.routes.js";
import videoRoutes from "./routes/video.routes.js";

const app = express();

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
app.use("/api/lives", liveRoutes);
app.use("/api/gifts", giftRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/moderation", moderationRoutes);
app.use("/api/videos", videoRoutes);

export default app;
