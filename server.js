require("dotenv").config();
const app = require("./src/app");

// const {
//   app: { port },
// } = require("./src/configs/config.mongodb");
const port = 3000;

const server = app.listen(port, () => {
  console.log(`Web service running on port: ${[port]}.`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exited Server Express"));
});
