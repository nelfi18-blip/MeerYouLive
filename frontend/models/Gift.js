import mongoose from "mongoose";

const GiftSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    liveId: { type: mongoose.Schema.Types.ObjectId, ref: "Live" },
    giftId: { type: String, required: true },
    giftName: { type: String, required: true },
    coins: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Gift ||
  mongoose.model("Gift", GiftSchema);
