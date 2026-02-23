import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
    live: { type: mongoose.Schema.Types.ObjectId, ref: "Live" },
    amount: Number,
    stripeSessionId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", purchaseSchema);
