import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
    amount: { type: Number, required: true },
    stripeSessionId: { type: String, required: true }
  },
  { timestamps: true }
);

purchaseSchema.index({ user: 1, video: 1 }, { unique: true });

export default mongoose.model("Purchase", purchaseSchema);
