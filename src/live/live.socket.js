import { io } from "../server.js";

io.on("connection", (socket) => {
  socket.on("join-live", ({ roomId }) => {
    socket.join(roomId);
    socket.to(roomId).emit("viewer-joined", socket.id);
  });

  socket.on("offer", (data) => socket.to(data.roomId).emit("offer", data));
  socket.on("answer", (data) => socket.to(data.roomId).emit("answer", data));
  socket.on("ice", (data) => socket.to(data.roomId).emit("ice", data));

  socket.on("chat-message", ({ roomId, message, username }) => {
    io.to(roomId).emit("chat-message", { username, message });
  });

  socket.on("gift", ({ roomId, gift, username }) => {
    io.to(roomId).emit("gift", { username, gift });
  });

  socket.on("leave-live", ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("viewer-left", socket.id);
  });
});
