import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createSubscription = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        { price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID, quantity: 1 },
      ],
      success_url: `${process.env.FRONTEND_URL}/sub/success`,
      cancel_url: `${process.env.FRONTEND_URL}/sub/cancel`,
      metadata: {
        creatorId: req.params.creatorId,
        userId: req.userId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
