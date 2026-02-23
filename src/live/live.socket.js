export default function setupLiveSocket(io) {
  io.on("connection", (socket) => {
    socket.on("join-live", ({ roomId }) => {
      if (!roomId || typeof roomId !== "string" || !/^[\w-]{1,64}$/.test(roomId)) return;
      socket.join(roomId);
      socket.to(roomId).emit("viewer-joined", socket.id);
    });

    socket.on("offer", (data) => {
      if (!data?.roomId || typeof data.roomId !== "string") return;
      socket.to(data.roomId).emit("offer", data);
    });
    socket.on("answer", (data) => {
      if (!data?.roomId || typeof data.roomId !== "string") return;
      socket.to(data.roomId).emit("answer", data);
    });
    socket.on("ice", (data) => {
      if (!data?.roomId || typeof data.roomId !== "string") return;
      socket.to(data.roomId).emit("ice", data);
    });
  });
}
