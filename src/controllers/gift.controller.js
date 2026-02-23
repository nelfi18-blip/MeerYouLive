import Stripe from "stripe";
import Gift from "../models/Gift.js";
import Live from "../models/Live.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const GIFT_CATALOG = {
  rose: { label: "Rosa 🌹", amount: 1 },
  heart: { label: "Corazón ❤️", amount: 2 },
  star: { label: "Estrella ⭐", amount: 5 },
  diamond: { label: "Diamante 💎", amount: 10 },
  rocket: { label: "Cohete 🚀", amount: 20 },
};

export const sendGift = async (req, res) => {
  try {
    const { liveId } = req.params;
    const { giftType } = req.body;

    const live = await Live.findById(liveId);
    if (!live || live.status !== "live") {
      return res.status(404).json({ message: "Live no encontrado o no activo" });
    }

    const gift = GIFT_CATALOG[giftType];
    if (!gift) {
      return res.status(400).json({ message: "Tipo de regalo no válido" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${gift.label} para ${live.title}` },
            unit_amount: gift.amount * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "gift",
        userId: req.userId,
        liveId: String(live._id),
        giftType,
        amount: String(gift.amount),
      },
      success_url: `${process.env.FRONTEND_URL}/live/${live._id}?gift=success`,
      cancel_url: `${process.env.FRONTEND_URL}/live/${live._id}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listGifts = async (req, res) => {
  try {
    const gifts = await Gift.find({ live: req.params.liveId })
      .populate("sender", "username name")
      .sort({ createdAt: -1 });
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
