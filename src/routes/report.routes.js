import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createReport, getReports, resolveReport } from "../controllers/report.controller.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = Router();

const reportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

router.post("/", reportLimiter, verifyToken, createReport);
router.get("/", reportLimiter, verifyToken, isAdmin, getReports);
router.put("/:id/resolve", reportLimiter, verifyToken, isAdmin, resolveReport);

export default router;
