import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import Subscription from "../models/Subscription.js";

const router = Router();

const liveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.get("/access/:creatorId", liveLimiter, verifyToken, async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      subscriber: req.userId,
      creator: req.params.creatorId,
      status: "active",
    });
    res.json({ access: !!sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
