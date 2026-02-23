import mongoose from "mongoose";

const liveSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["public", "private", "subscribers"], default: "public" },
    status: { type: String, enum: ["scheduled", "live", "ended"], default: "live" },
    price: { type: Number, default: 0 },
    viewerCount: { type: Number, default: 0 },
    startedAt: { type: Date },
    endedAt: { type: Date },
    recordingUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Live", liveSchema);
