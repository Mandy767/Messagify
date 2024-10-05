const crypto = require("crypto");
const Message = require("../models/message");
const User = require("../models/user");
const env = require("../config/env");

class MessageServices {
  constructor() {
    this.encryptionKey = crypto.scryptSync(env.MESSAGE_SECRET_KEY, "salt", 32);
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      env.ALGORITHM,
      Buffer.from(this.encryptionKey),
      iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }

  decrypt(text) {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(
      env.ALGORITHM,
      Buffer.from(this.encryptionKey),
      iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  async createMessage(senderId, recipientId, content) {
    try {
      const sender = await User.findById(senderId);
      const recipient = await User.findById(recipientId);

      if (!sender || !recipient) {
        throw new Error("Invalid users");
      }

      const encryptedContent = this.encrypt(content);

      const message = new Message({
        sender: senderId,
        recipient: recipientId,
        content: encryptedContent,
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

      const decryptedMessages = messages.map((message) => ({
        ...message.toObject(),
        content: this.decrypt(message.content),
      }));

      return decryptedMessages;
    } catch (err) {
      throw new Error(`Failed to retrieve messages: ${err.message}`);
    }
  }
}

module.exports = MessageServices;
