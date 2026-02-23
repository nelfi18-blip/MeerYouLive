import mongoose from "mongoose";

const giftSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    live: { type: mongoose.Schema.Types.ObjectId, ref: "Live", required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Gift", giftSchema);
