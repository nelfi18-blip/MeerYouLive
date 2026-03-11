import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import UserWallet from "@/models/UserWallet";

export async function POST(request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] Invalid signature:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await connectDB();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { customer_email, amount_total, currency, id: stripeSessionId } = session;

      const coins = session.metadata?.coins ? parseInt(session.metadata.coins, 10) : 0;

      await Transaction.create({
        stripeSessionId,
        email: customer_email,
        amount: amount_total,
        currency,
        status: "completed",
        coins,
      });

      if (coins > 0) {
        await UserWallet.findOneAndUpdate(
          { email: customer_email },
          { $inc: { coins } },
          { upsert: true, new: true }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[stripe/webhook]", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
