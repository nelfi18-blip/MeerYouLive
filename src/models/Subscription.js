import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stripeSubscriptionId: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ["active", "cancelled", "expired"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
