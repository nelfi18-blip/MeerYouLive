import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { setIO } from "./socket.js";

const PORT = process.env.PORT || 10000;

connectDB();

const server = http.createServer(app);

const allowedOrigins = process.env.FRONTEND_URL
  ? [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL.replace("://", "://www."),
    ]
  : [];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

setIO(io);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Token requerido"));
  if (!process.env.JWT_SECRET) return next(new Error("JWT_SECRET no configurado"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = String(decoded.id);
    socket.username = socket.handshake.auth.username || socket.userId;
    next();
  } catch {
    next(new Error("Token inválido"));
  }
});

io.on("connection", (socket) => {
  socket.on("live:join", (liveId) => {
    socket.join(liveId);
    const count = io.sockets.adapter.rooms.get(liveId)?.size || 0;
    io.to(liveId).emit("viewers:update", count);
  });

  socket.on("live:leave", (liveId) => {
    socket.leave(liveId);
    const count = io.sockets.adapter.rooms.get(liveId)?.size || 0;
    io.to(liveId).emit("viewers:update", count);
  });

  socket.on("chat:message", ({ liveId, text }) => {
    if (!text || typeof text !== "string") return;
    const trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > 200) return;
    io.to(liveId).emit("chat:message", {
      userId: socket.userId,
      username: socket.username,
      text: trimmed,
      createdAt: new Date().toISOString(),
    });
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
