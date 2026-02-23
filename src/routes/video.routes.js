import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { listVideos, getVideo } from "../controllers/video.controller.js";

const router = Router();

const videoLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.get("/", videoLimiter, listVideos);
router.get("/:id", videoLimiter, verifyToken, getVideo);

export default router;
