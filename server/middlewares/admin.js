const isAuthenticated = require("./auth");

module.exports = async (req, res, next) => {
  try {
    isAuthenticated(req, res, () => {
      if (req.session.user.isAdmin) {
        next();
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }
    });
  } catch (err) {
    next(err);
  }
};
