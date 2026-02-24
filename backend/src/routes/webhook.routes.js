import { Router } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import { handleWebhook } from "../controllers/payment.controller.js";

const router = Router();

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes" },
});

router.post("/stripe", webhookLimiter, express.raw({ type: "application/json" }), handleWebhook);

export default router;
