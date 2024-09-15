const jwt = require("jsonwebtoken");
const { JWT_SECRET, ADMIN_USERNAME } = require("../config/env");

const UserServices = require("../services/user");

const userServices = new UserServices();

module.exports = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await userServices.getUserById(id);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.session.user = user;
    if (user.username === ADMIN_USERNAME) {
      req.session.user.isAdmin = true;
    }
    next();
  } catch (err) {
    next(err);
  }
};
