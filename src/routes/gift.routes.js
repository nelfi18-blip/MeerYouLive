import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { sendGift, listGifts } from "../controllers/gift.controller.js";

const router = Router();

const giftLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.post("/:liveId/gifts", giftLimiter, verifyToken, sendGift);
router.get("/:liveId/gifts", giftLimiter, listGifts);

export default router;
