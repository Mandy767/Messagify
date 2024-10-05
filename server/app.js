const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { store } = require("./config/database");
const env = require("./config/env");
const http = require("http");
const router = require("./routes/router");
const errorHandler = require("./middlewares/errorhandler");
const socketSetup = require("./services/socket");
const app = express();

const server = http.createServer(app);
const io = socketSetup(server);
app.use(morgan("dev"));
app.use(cookieParser(env.JWT_SECRET));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
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

app.use(errorHandler.get404);
app.use(errorHandler.global);

module.exports = { server };
