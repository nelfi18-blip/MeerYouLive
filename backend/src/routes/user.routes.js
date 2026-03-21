const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { verifyToken } = require("../middlewares/auth.middleware.js");
const User = require("../models/User.js");

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
  const allowed = ["username", "name", "bio"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = typeof req.body[key] === "string" ? req.body[key].trim() : req.body[key];
    }
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No hay campos válidos para actualizar" });
  }
  try {
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0];
      if (field === "username") return res.status(400).json({ message: "Ese nombre de usuario ya está en uso" });
      return res.status(400).json({ message: "Ya existe una cuenta con esos datos" });
    }
    res.status(400).json({ message: err.message });
  }
});

router.get("/coins", userLimiter, verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("coins earningsCoins");
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ coins: user.coins, earningsCoins: user.earningsCoins });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
