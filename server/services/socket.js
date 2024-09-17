const { Server } = require("socket.io");
const MessageServices = require("./message");
const messageServices = new MessageServices();

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const session = socket.request.session;
    if (session && session.user) {
      console.log("User session:", session.user);
    }

    socket.on("send_message", async (data, callback) => {
      const { recipientId, content } = data;
      const senderId = session.user._id;

      try {
        const message = await messageServices.createMessage(
          senderId,
          recipientId,
          content
        );
        io.to(recipientId).emit("receive_message", {
          senderId,
          content,
          timestamp: message.createdAt,
        });
        callback({ status: "success" });
      } catch (err) {
        console.error("Error sending message:", err);
        callback({ status: "error", error: err.message });
      }
    });

    socket.on("get_messages", async (data, callback) => {
      const { userId1, userId2 } = data;
      try {
        const messages = await messageServices.getMessagesBetweenUsers(
          userId1,
          userId2
        );
        callback(messages);
      } catch (err) {
        console.error("Error retrieving messages:", err);
        callback([]);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};
