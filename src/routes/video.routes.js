import { Router } from "express";
import rateLimit from "express-rate-limit";
import Video from "../models/Video.js";

const router = Router();

const videoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.get("/:id", videoLimiter, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).select(
      "title description isPrivate price teaserUrl url"
    );
    if (!video) return res.status(404).json({ message: "Vídeo no encontrado" });

    if (video.isPrivate) {
      const { url: _url, ...safe } = video.toObject();
      return res.json(safe);
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
