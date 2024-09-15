const router = require("express").Router();

const userController = require("../controllers/user");
const authMiddleware = require("../middlewares/auth");
const isAdmin = require("../middlewares/admin");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.get("/me", authMiddleware, userController.getMe);
router.post("/admin/password", isAdmin, userController.updateAdminPassword);

module.exports = {
  use: "/user",
  router,
};
