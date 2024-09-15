require("dotenv").config();

const { PORT, MONGODB_URI, JWT_SECRET, JWT_EXPIRY, ADMIN_USERNAME } =
  process.env;

const config = {
  PORT: PORT,
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRY,
  ADMIN_USERNAME,
};

module.exports = config;
