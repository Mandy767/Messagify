const { server } = require("./app"); // Import both app and server
const env = require("./config/env");
require("./config/database");

const PORT = env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception: ", error);
});
