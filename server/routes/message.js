const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const { sendMessage, getMessages } = require("../controllers/message");

router.post("/sendMessage", authMiddleware, sendMessage);
router.get("/messages/:userId1/:userId2", authMiddleware, getMessages);

module.exports = {
  use: "/message",
  router,
};
