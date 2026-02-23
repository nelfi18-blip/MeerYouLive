import Stripe from "stripe";
import Video from "../models/Video.js";
import Purchase from "../models/Purchase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);
    if (!video) {
      return res.status(404).json({ message: "Vídeo no encontrado" });
    }

    const alreadyPurchased = await Purchase.findOne({
      user: req.userId,
      video: video._id
    });
    if (alreadyPurchased) {
      return res.status(409).json({ message: "Ya compraste este vídeo" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: video.title
            },
            unit_amount: video.price * 100
          },
          quantity: 1
        }
      ],
      metadata: {
        userId: req.userId.toString(),
        videoId: video._id.toString()
      },
      success_url: `${process.env.FRONTEND_URL}/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const canWatchVideo = async (req, res) => {
  try {
    const bought = await Purchase.findOne({
      user: req.userId,
      video: req.params.videoId
    });

    res.json({ access: !!bought });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
