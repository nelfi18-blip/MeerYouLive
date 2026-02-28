import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import User from "../models/User.js";

const router = Router();

const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.get("/me", userLimiter, verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/me", userLimiter, verifyToken, async (req, res) => {
  const { username, name } = req.body;
  const update = {};
  if (username !== undefined) update.username = username;
  if (name !== undefined) update.name = name;

  try {
    const user = await User.findByIdAndUpdate(req.userId, update, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "El nombre de usuario ya está en uso" });
    }
    res.status(400).json({ message: err.message });
  }
});

export default router;
