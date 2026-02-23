import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripeSubscriptionId: { type: String },
    status: {
      type: String,
      enum: ["active", "cancelled", "past_due"],
      default: "active",
    },
    endsAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
