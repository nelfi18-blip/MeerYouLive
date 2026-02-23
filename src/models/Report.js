import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    targetVideo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

reportSchema.pre("save", function (next) {
  if (!this.targetUser && !this.targetVideo) {
    return next(new Error("Se requiere targetUser o targetVideo"));
  }
  next();
});

export default mongoose.model("Report", reportSchema);
