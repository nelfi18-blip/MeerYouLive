import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "cancelled", "expired"], default: "active" },
    stripeSubscriptionId: { type: String },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
