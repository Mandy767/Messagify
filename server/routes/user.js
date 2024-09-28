const router = require("express").Router();
const { imageUpload } = require("../middlewares/uploadimage");

const userController = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");

router.post("/register", imageUpload(), userController.registerUser);

router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.get("/me", authMiddleware, userController.getMe);
router.post("/admin/password", isAdmin, userController.updateAdminPassword);

// router.post("/addFriend", authMiddleware, userController.addFriend);

router.post("/request/send", authMiddleware, userController.sendFriendRequest);
router.post(
  "/request/respond",
  authMiddleware,
  userController.respondToFriendRequest
);
router.get(
  "/request/:userId",
  authMiddleware,
  userController.getFriendRequests
);

router.get(
  "/request/find/:userId/:friendId",
  authMiddleware,
  userController.getRequestsBySenderReceiverids
);

router.post("/removeFriend", authMiddleware, userController.removeFriend);

router.post("/friends", authMiddleware, userController.getFriends);

router.get("/users", authMiddleware, userController.getAllUsersExceptSelf);

router.get("/friend/:id", authMiddleware, userController.getFriendById);

module.exports = {
  use: "/user",
  router,
};
