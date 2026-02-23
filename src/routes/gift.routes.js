import { Router } from "express";
import Stripe from "stripe";
import rateLimit from "express-rate-limit";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const giftLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Demasiadas solicitudes, intenta de nuevo más tarde" },
});

const ALLOWED_AMOUNTS_CENTS = new Set([300, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7500, 10000, 15000, 20000]);

router.post("/", giftLimiter, verifyToken, async (req, res) => {
  const { recipientId, amount } = req.body;

  if (!recipientId) {
    return res.status(400).json({ message: "recipientId es requerido" });
  }

  const parsedAmount = parseFloat(amount);
  if (!parsedAmount || parsedAmount <= 0) {
    return res.status(400).json({ message: "amount debe ser un número positivo" });
  }
  const amountCents = Math.round(parsedAmount * 100);
  if (!ALLOWED_AMOUNTS_CENTS.has(amountCents)) {
    return res.status(400).json({ message: "Monto no permitido" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Regalo a creador en MeetYouLive 🎁" },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "gift",
        senderId: req.userId,
        recipientId,
        amount: String(parsedAmount),
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
