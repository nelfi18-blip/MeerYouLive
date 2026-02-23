import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createLive,
  listLives,
  getLive,
  joinLive,
  endLive,
  checkoutLiveAccess,
} from "../controllers/live.controller.js";

const router = Router();

const liveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.get("/", liveLimiter, listLives);
router.post("/", liveLimiter, verifyToken, createLive);
router.get("/:liveId", liveLimiter, getLive);
router.post("/:liveId/join", liveLimiter, verifyToken, joinLive);
router.post("/:liveId/end", liveLimiter, verifyToken, endLive);
router.post("/:liveId/checkout", liveLimiter, verifyToken, checkoutLiveAccess);

export default router;
