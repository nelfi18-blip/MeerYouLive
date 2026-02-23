import express from "express";
import Stripe from "stripe";
import Purchase from "../models/Purchase.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/stripe",
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
      return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { userId, videoId } = session.metadata || {};

      if (userId && videoId) {
        try {
          await Purchase.create({
            user: userId,
            video: videoId,
            amount: session.amount_total / 100,
            stripeSessionId: session.id
          });
        } catch (err) {
          console.error("Error saving purchase:", err);
          return res.status(500).json({ message: "Error saving purchase" });
        }
      }
    }

    res.json({ received: true });
  }
);

export default router;
