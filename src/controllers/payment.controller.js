import Stripe from "stripe";
import Video from "../models/Video.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Vídeo no encontrado" });
    if (!video.isPrivate || video.price <= 0) {
      return res.status(400).json({ message: "Este vídeo no requiere pago" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: video.title,
            },
            unit_amount: Math.round(video.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.userId,
        videoId: String(video._id),
        amount: String(video.price),
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const handleWebhook = async (req, res) => {
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
    const session = event.data.object;
    const { userId, videoId, amount } = session.metadata;

    try {
      const existing = await Purchase.findOne({ stripeSessionId: session.id });
      if (!existing) {
        await Purchase.create({
          user: userId,
          video: videoId,
          amount: parseFloat(amount),
          stripeSessionId: session.id,
        });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  res.json({ received: true });
};

export const buyWithCoins = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) return res.status(404).json({ message: "Vídeo no encontrado" });
    if (!video.isPrivate || video.price <= 0) {
      return res.status(400).json({ message: "Este vídeo no requiere pago" });
    }

    const existing = await Purchase.findOne({ user: req.userId, video: video._id });
    if (existing) return res.status(400).json({ message: "Ya tienes acceso a este vídeo" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    if (user.coins < video.price) {
      return res.status(402).json({ message: "Monedas insuficientes" });
    }

    user.coins -= video.price;
    await user.save();
    try {
      await Purchase.create({ user: req.userId, video: video._id, amount: video.price });
    } catch (purchaseErr) {
      user.coins += video.price;
      await user.save();
      throw purchaseErr;
    }

    res.json({ message: "Vídeo desbloqueado", coins: user.coins });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
