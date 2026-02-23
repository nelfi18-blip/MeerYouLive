import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "MeetYouLive API running 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

export default app;
