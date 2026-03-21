const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const { verifyToken } = require("../middlewares/auth.middleware.js");
const { startLive, endLive, getLives, getLiveById } = require("../controllers/live.controller.js");

const router = Router();

const liveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.get("/", liveLimiter, getLives);
router.get("/:id", liveLimiter, getLiveById);
router.post("/start", liveLimiter, verifyToken, startLive);
router.patch("/:id/end", liveLimiter, verifyToken, endLive);

module.exports = router;
