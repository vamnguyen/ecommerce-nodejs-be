const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//  init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./databases/init.mongodb");

// init routes
app.use("/", require("./routes"));
app.use("/v1/api", require("./routes/access"));

// handling errors

module.exports = app;
