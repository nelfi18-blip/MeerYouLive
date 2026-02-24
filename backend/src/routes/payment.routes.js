import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { canWatchVideo } from "../controllers/video.controller.js";

const router = Router();

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.post("/checkout/:videoId", paymentLimiter, verifyToken, createCheckoutSession);
router.get("/access/:videoId", paymentLimiter, verifyToken, canWatchVideo);

export default router;
