import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import Subscription from "../models/Subscription.js";

const router = Router();

const subLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.post("/:creatorId", subLimiter, verifyToken, async (req, res) => {
  const { creatorId } = req.params;
  if (req.userId.toString() === creatorId) {
    return res.status(400).json({ message: "No puedes suscribirte a ti mismo" });
  }
  try {
    const existing = await Subscription.findOne({
      subscriber: req.userId,
      creator: creatorId,
      status: "active",
    });
    if (existing) {
      return res.status(409).json({ message: "Ya estás suscrito" });
    }
    const sub = await Subscription.create({
      subscriber: req.userId,
      creator: creatorId,
    });
    res.status(201).json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:creatorId", subLimiter, verifyToken, async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { subscriber: req.userId, creator: req.params.creatorId, status: "active" },
      { status: "cancelled" },
      { new: true }
    );
    if (!sub) return res.status(404).json({ message: "Suscripción no encontrada" });
    res.json({ message: "Suscripción cancelada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/check/:creatorId", subLimiter, verifyToken, async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      subscriber: req.userId,
      creator: req.params.creatorId,
      status: "active",
    });
    res.json({ subscribed: !!sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
