import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createSubscriptionSession,
  getSubscriptionStatus,
  cancelSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();

const subLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.post("/checkout", subLimiter, verifyToken, createSubscriptionSession);
router.get("/status", subLimiter, verifyToken, getSubscriptionStatus);
router.delete("/cancel", subLimiter, verifyToken, cancelSubscription);

export default router;
