const { Server } = require("socket.io");

const MessageServices = require("./message");
const messageServices = new MessageServices();

const userSocketMap = new Map();
const onlineUsers = new Set();

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    const sender = socket.handshake.headers.authorization;

    userSocketMap.set(sender, socket.id);

    const isOnline = userSocketMap.has(sender);

    socket.on("send_message", async (data) => {
      const { recipient, content } = data;

      try {
        const message = await messageServices.createMessage(
          sender,
          recipient,
          content
        );

        io.to(userSocketMap.get(recipient)).emit("receive_message", {
          sender,
          recipient: recipient,
          content,
          createdAt: message.createdAt,
        });
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      if (sender) {
        userSocketMap.delete(sender);
        socket.leave(sender);
      }
    });
  });

  return io;
};
