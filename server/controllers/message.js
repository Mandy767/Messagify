const MessageServices = require("../services/message");
const messageServices = new MessageServices();

exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.session.user._id;

    const message = await messageServices.createMessage(
      senderId,
      recipientId,
      content
    );
    return res.status(201).json({ message });
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await messageServices.getMessagesBetweenUsers(
      userId1,
      userId2
    );
    return res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};
