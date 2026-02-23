import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createSubscription } from "../controllers/subscription.controller.js";

const router = Router();

const subscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.post("/:creatorId", subscriptionLimiter, verifyToken, createSubscription);

export default router;
