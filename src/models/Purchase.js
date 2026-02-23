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

purchaseSchema.pre("validate", function (next) {
  if (!this.video && !this.live) {
    return next(new Error("Una compra debe estar asociada a un video o a un live"));
  }
  next();
});

export default mongoose.model("Purchase", purchaseSchema);
