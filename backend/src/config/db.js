const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI environment variable");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error MongoDB:", error.message);
    throw error;
  }
};

module.exports = { connectDB };