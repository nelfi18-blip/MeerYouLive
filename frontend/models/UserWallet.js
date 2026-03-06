import mongoose from "mongoose";

const UserWalletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true, unique: true },
    coins: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.UserWallet ||
  mongoose.model("UserWallet", UserWalletSchema);
