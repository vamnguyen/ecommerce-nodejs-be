const app = require("./src/app");

const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => {
  console.log(`Web service running on port ${PORT}.`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exited Server Express"));
});
