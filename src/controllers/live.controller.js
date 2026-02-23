import jwt from "jsonwebtoken";
import Stripe from "stripe";
import Live from "../models/Live.js";
import Purchase from "../models/Purchase.js";
import Subscription from "../models/Subscription.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createLive = async (req, res) => {
  try {
    const { title, description, type, price } = req.body;
    if (!title) return res.status(400).json({ message: "El título es requerido" });
    if (type === "private" && (!price || price <= 0)) {
      return res.status(400).json({ message: "Un live privado requiere un precio mayor a 0" });
    }
    const live = await Live.create({
      creator: req.userId,
      title,
      description,
      type: type || "public",
      price: type === "private" ? price : 0,
      status: "live",
      startedAt: new Date(),
    });
    res.status(201).json(live);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listLives = async (req, res) => {
  try {
    const lives = await Live.find({ status: "live" })
      .populate("creator", "username name")
      .sort({ createdAt: -1 });
    res.json(lives);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLive = async (req, res) => {
  try {
    const live = await Live.findById(req.params.liveId).populate("creator", "username name");
    if (!live) return res.status(404).json({ message: "Live no encontrado" });
    res.json(live);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinLive = async (req, res) => {
  try {
    const live = await Live.findById(req.params.liveId);
    if (!live) return res.status(404).json({ message: "Live no encontrado" });
    if (live.status !== "live") {
      return res.status(400).json({ message: "Este live no está activo" });
    }

    const isCreator = String(live.creator) === String(req.userId);

    if (!isCreator) {
      if (live.type === "private") {
        const purchase = await Purchase.findOne({ user: req.userId, live: live._id });
        if (!purchase) {
          return res.status(403).json({ message: "Debes comprar acceso a este live", requiresPurchase: true });
        }
      } else if (live.type === "subscribers") {
        const sub = await Subscription.findOne({
          subscriber: req.userId,
          creator: live.creator,
          status: "active",
          expiresAt: { $gt: new Date() },
        });
        if (!sub) {
          return res.status(403).json({ message: "Debes tener una suscripción activa", requiresSubscription: true });
        }
      }
    }

    const liveToken = jwt.sign(
      { userId: req.userId, liveId: String(live._id), channel: String(live._id) },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.json({
      liveToken,
      channel: String(live._id),
      agoraAppId: process.env.AGORA_APP_ID || null,
      live,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const endLive = async (req, res) => {
  try {
    const live = await Live.findById(req.params.liveId);
    if (!live) return res.status(404).json({ message: "Live no encontrado" });
    if (String(live.creator) !== String(req.userId)) {
      return res.status(403).json({ message: "Solo el creador puede terminar el live" });
    }
    live.status = "ended";
    live.endedAt = new Date();
    await live.save();
    res.json({ message: "Live terminado", live });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const checkoutLiveAccess = async (req, res) => {
  try {
    const live = await Live.findById(req.params.liveId);
    if (!live) return res.status(404).json({ message: "Live no encontrado" });
    if (live.type !== "private" || live.price <= 0) {
      return res.status(400).json({ message: "Este live no requiere pago" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Acceso al live: ${live.title}` },
            unit_amount: Math.round(live.price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "livePurchase",
        userId: req.userId,
        liveId: String(live._id),
        amount: String(live.price),
      },
      success_url: `${process.env.FRONTEND_URL}/live/${live._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/live/${live._id}`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
