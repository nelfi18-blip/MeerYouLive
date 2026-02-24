import { Router } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import Stripe from "stripe";
import { handlePaymentCompleted } from "../controllers/payment.controller.js";
import { handleSubscriptionWebhook } from "../controllers/subscription.controller.js";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const router = Router();

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes" },
});

router.post(
  "/stripe",
  webhookLimiter,
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const stripe = getStripe();
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      return res.status(400).json({ message: `Webhook error: ${err.message}` });
    }

    try {
      if (event.type === "checkout.session.completed" && event.data.object.mode === "payment") {
        await handlePaymentCompleted(event.data.object);
      } else {
        await handleSubscriptionWebhook(event);
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }

    res.json({ received: true });
  }
);

export default router;
