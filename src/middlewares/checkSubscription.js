import Subscription from "../models/Subscription.js";

export const hasSubscription = async (req, res, next) => {
  try {
    const ok = await Subscription.findOne({
      user: req.userId,
      creator: req.params.creatorId,
      status: "active",
    });

    if (!ok) return res.status(403).json({ message: "Suscripción requerida" });
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
