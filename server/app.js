const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { store } = require("./config/database");
const env = require("./config/env");
const http = require("http"); // Import http module
const router = require("./routes/router");
const errorHandler = require("./middlewares/errorHandler");
const socketSetup = require("./services/socket");
const app = express();

// Create an http server
const server = http.createServer(app); // Create the server
const io = socketSetup(server);
app.use(morgan("dev"));
app.use(cookieParser(env.JWT_SECRET));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true, // Access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);

app.use(
  session({
    secret: env.JWT_SECRET || "somesecret",
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));
app.use("/api", router);

// Error handling
app.use(errorHandler.get404);
app.use(errorHandler.global);

// Export the app and the server
module.exports = { app, server }; // Export both app and server
