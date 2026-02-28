import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken, optionalToken } from "../middlewares/auth.middleware.js";
import { createVideo, getVideos, getVideo, deleteVideo } from "../controllers/video.controller.js";

const router = Router();

const videoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.get("/", videoLimiter, getVideos);
router.get("/:id", videoLimiter, optionalToken, getVideo);
router.post("/", videoLimiter, verifyToken, createVideo);
router.delete("/:id", videoLimiter, verifyToken, deleteVideo);

export default router;
