import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { startLive, endLive, getLives } from "../controllers/live.controller.js";

const router = Router();

const liveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.get("/", liveLimiter, getLives);
router.post("/start", liveLimiter, verifyToken, startLive);
router.patch("/:id/end", liveLimiter, verifyToken, endLive);

export default router;
