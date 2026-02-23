import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import Video from "../models/Video.js";

const router = Router();

const videoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.get("/", videoLimiter, async (req, res) => {
  try {
    const videos = await Video.find({ isPrivate: false })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("user", "username name");
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", videoLimiter, verifyToken, async (req, res) => {
  const { title, description, url, isPrivate, price } = req.body;
  if (!title || !url) {
    return res.status(400).json({ message: "title y url son requeridos" });
  }
  try {
    const video = await Video.create({
      user: req.userId,
      title,
      description,
      url,
      isPrivate: isPrivate || false,
      price: price || 0,
    });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
