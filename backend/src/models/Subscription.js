import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive", "canceled", "past_due"],
      default: "inactive",
    },
    currentPeriodEnd: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
