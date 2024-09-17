const { Server } = require("socket.io");
const MessageServices = require("./message");
const messageServices = new MessageServices();

// Create a mapping between userId and socketId
const userSocketMap = new Map();

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
      const userId = session.user._id;

      // Map the userId to the socketId
      userSocketMap.set(userId, socket.id);

      // Join a room for the user
      socket.join(userId);

      console.log("User session:", session.user);
    }

    socket.on("send_message", async (data, callback) => {
      const { recipientId, content } = data;
      const senderId = session.user._id;

      // Create a unique room name for the conversation
      const roomName = [senderId, recipientId].sort().join("_");

      try {
        const message = await messageServices.createMessage(
          senderId,
          recipientId,
          content
        );

        // Emit the message to the room
        io.to(roomName).emit("receive_message", {
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

      // Remove the userId from the map and leave their room
      if (session && session.user) {
        userSocketMap.delete(session.user._id);
        socket.leave(session.user._id);
      }
    });
  });

  return io;
};
