require("dotenv").config();

const {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRY,
  ADMIN_USERNAME,
  MESSAGE_SECRET_KEY,
  ALGORITHM,
} = process.env;

const config = {
  PORT: PORT,
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRY,
  ADMIN_USERNAME,
  MESSAGE_SECRET_KEY,
  ALGORITHM,
};

module.exports = config;
