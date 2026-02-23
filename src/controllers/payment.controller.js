import Stripe from "stripe";
import Video from "../models/Video.js";
import Purchase from "../models/Purchase.js";
import Gift from "../models/Gift.js";
import { getIO } from "../socket.js";

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
    const { type, userId, videoId, liveId, giftType, amount } = session.metadata;

    try {
      if (type === "gift") {
        const existing = await Gift.findOne({ stripeSessionId: session.id });
        if (!existing) {
          const gift = await Gift.create({
            sender: userId,
            live: liveId,
            type: giftType,
            amount: parseFloat(amount),
            stripeSessionId: session.id,
          });
          const populatedGift = await gift.populate("sender", "username name");
          const io = getIO();
          if (io) {
            io.to(liveId).emit("gift:received", {
              giftType,
              amount: parseFloat(amount),
              sender: populatedGift.sender,
            });
          }
        }
      } else if (type === "livePurchase") {
        const existing = await Purchase.findOne({ stripeSessionId: session.id });
        if (!existing) {
          await Purchase.create({
            user: userId,
            live: liveId,
            amount: parseFloat(amount),
            stripeSessionId: session.id,
          });
        }
      } else {
        const existing = await Purchase.findOne({ stripeSessionId: session.id });
        if (!existing) {
          await Purchase.create({
            user: userId,
            video: videoId,
            amount: parseFloat(amount),
            stripeSessionId: session.id,
          });
        }
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  res.json({ received: true });
};
