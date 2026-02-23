import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { sendGift, getReceivedGifts } from "../controllers/gift.controller.js";

const router = Router();

const giftLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.post("/", giftLimiter, verifyToken, sendGift);
router.get("/received", giftLimiter, verifyToken, getReceivedGifts);

export default router;
