const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const app = express();

//  init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./databases/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

// init routes
app.use("/", (req, res, next) => {
  const strCompress = "Hello World!";
  return res.status(200).json({
    message: "Welcome to the BE-Nodejs Course!",
    metadata: strCompress.repeat(10000),
  });
});

// handling errors

module.exports = app;
