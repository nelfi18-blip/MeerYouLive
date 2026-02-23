import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { uploadVideo, getPublicVideos } from "../controllers/video.controller.js";

const router = Router();

const videoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" }
});

router.get("/public", videoLimiter, getPublicVideos);
router.post("/upload", videoLimiter, verifyToken, upload.single("video"), uploadVideo);

export default router;
