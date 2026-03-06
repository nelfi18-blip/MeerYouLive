import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    stripeSessionId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    coins: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
