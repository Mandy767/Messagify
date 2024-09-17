const joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { JWT_SECRET, ADMIN_USERNAME } = require("../config/env");

class UserService {
  userValidator(userData) {
    const schema = joi.object({
      name: joi.string().required(),
      username: joi.string().required(),
      password: joi.string().required(),
      profilepic: joi.string().required(),
      friends: joi.array(),
    });
    return schema.validate(userData);
  }

  async createUser(userData) {
    let { value, error } = this.userValidator(userData);
    if (error) throw new Error(error);
    const newUser = new User(value);
    return await newUser.save();
  }

  async loginUser(username, password) {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw new Error("Invalid password");

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    return token;
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async updateAdminPassword(password) {
    const admin = await User.findOne({ username: ADMIN_USERNAME });

    admin.password = password;

    await admin.save();

    return admin;
  }

  async getAllUsersExcept(excludeUserId) {
    try {
      return await User.find({ _id: { $ne: excludeUserId } });
    } catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  }
}

module.exports = UserService;
