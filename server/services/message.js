const Message = require("../models/message");
const User = require("../models/user");

class MessageServices {
  async createMessage(senderId, recipientId, content) {
    try {
      const sender = await User.findById(senderId);
      const recipient = await User.findById(recipientId);

      if (!sender || !recipient) {
        throw new Error("Invalid users");
      }

      const message = new Message({
        sender: senderId,
        recipient: recipientId,
        content,
      });

      await message.save();

      return message;
    } catch (err) {
      throw new Error(`Failed to send message: ${err.message}`);
    }
  }

  async getMessagesBetweenUsers(userId1, userId2) {
    try {
      const messages = await Message.find({
        $or: [
          { sender: userId1, recipient: userId2 },
          { sender: userId2, recipient: userId1 },
        ],
      })
        .sort({ createdAt: 1 })
        .exec();

      return messages;
    } catch (err) {
      throw new Error(`Failed to retrieve messages: ${err.message}`);
    }
  }
}

module.exports = MessageServices;
