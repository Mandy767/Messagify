const { ADMIN_USERNAME } = require("../config/env");
const UserServices = require("../services/user");

const userServices = new UserServices();

exports.registerUser = async (req, res, next) => {
  try {
    const userData = req.body;
    const newUser = await userServices.createUser(userData);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await userServices.loginUser(username, password);
    const type = ADMIN_USERNAME || "admin" === username ? "admin" : "user";

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ token, type });
  } catch (err) {
    err.statusCode = 200;
    next(err);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    req.session.destroy();
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const { _id } = req.session.user;
    const user = await userServices.getUserById(_id);
    const type = ADMIN_USERNAME || "admin" === user.username ? "admin" : "user";
    res.status(200).json({
      user,
      type,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAdminPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const updatedAdmin = await userServices.updateAdminPassword(password);

    res.status(200).json({
      admin: updatedAdmin,
    });
  } catch (err) {
    next(err);
  }
};
