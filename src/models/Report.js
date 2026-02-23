import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
    reason: String,
    status: { type: String, default: "pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
