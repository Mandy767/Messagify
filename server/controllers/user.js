const { ADMIN_USERNAME } = require("../config/env");
const UserServices = require("../services/user");
const User = require("../models/user");
const userServices = new UserServices();

exports.registerUser = async (req, res, next) => {
  try {
    const userData = req.body;
    console.log(userData);
    const newUser = await userServices.createUser({
      ...userData,
      profilepic: req?.file?.path,
    });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await userServices.loginUser(username, password);
    const type = ADMIN_USERNAME === username ? "admin" : "user";

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

    const profile = user.profilepic;
    console.log(profile);
    const type = ADMIN_USERNAME === user.username ? "admin" : "user";
    res.status(200).json({
      user,
      type,
      profile,
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

exports.addFriend = async (req, res) => {
  const { userId, friendId } = req.body;
  console.log(req.body);
  try {
    await User.findByIdAndUpdate(userId, { $addToSet: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $addToSet: { friends: userId } });
    return res.status(200).json({ message: "Friend added successfully!" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const user = await User.findById(userId).populate(
      "friends",
      "name username"
    );

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's friends
    return res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching friends: ", error);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.getAllUsersExceptSelf = async (req, res, next) => {
  try {
    // Assuming the user ID is stored in the session
    const { _id } = req.session.user;
    const users = await userServices.getAllUsersExcept(_id);

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
