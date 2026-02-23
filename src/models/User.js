import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"]
    },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
