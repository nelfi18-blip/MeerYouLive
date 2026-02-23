import { Router } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import Stripe from "stripe";
import { handleWebhook } from "../controllers/payment.controller.js";
import Subscription from "../models/Subscription.js";

const router = Router();

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { message: "Demasiadas solicitudes" },
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/stripe", webhookLimiter, express.raw({ type: "application/json" }), handleWebhook);

router.post(
  "/stripe-subscription",
  webhookLimiter,
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).json({ message: `Webhook error: ${err.message}` });
    }

    if (event.type === "checkout.session.completed") {
      const s = event.data.object;
      if (s.mode === "subscription" && s.metadata?.userId && s.metadata?.creatorId) {
        try {
          const existing = await Subscription.findOne({
            user: s.metadata.userId,
            creator: s.metadata.creatorId,
            stripeSubscriptionId: s.subscription,
          });
          if (!existing) {
            await Subscription.create({
              user: s.metadata.userId,
              creator: s.metadata.creatorId,
              stripeSubscriptionId: s.subscription,
              status: "active",
            });
          }
        } catch (err) {
          return res.status(500).json({ message: err.message });
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      try {
        await Subscription.updateMany(
          { stripeSubscriptionId: sub.id },
          { status: "cancelled" }
        );
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    }

    res.json({ received: true });
  }
);

export default router;
