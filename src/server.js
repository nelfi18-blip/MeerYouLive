import dotenv from "dotenv";
dotenv.config();

import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import setupLiveSocket from "./live/live.socket.js";

const PORT = process.env.PORT || 10000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL
      ? [
          process.env.FRONTEND_URL,
          process.env.FRONTEND_URL.replace("://", "://www."),
        ]
      : [],
    credentials: true,
  },
});

setupLiveSocket(io);

connectDB();

httpServer.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
