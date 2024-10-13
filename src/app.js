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

// test pub.sub redis
require("./test/inventory.test");
const productTest = require("./test/product.test");
productTest.purchaseProduct("product:001", 10);

// init db
require("./databases/init.mongodb");

// init routes
app.use("/", require("./routes"));

// handling errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
    stack: error.stack,
  });
});

module.exports = app;
