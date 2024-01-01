"use strict";

const mongoose = require("mongoose");
const os = require("os");

const _SECONDS = 5000;

// count Connections
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`The number of connections is ${numConnection}`);
};

// check overload connections
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on the number of cores
    const maxConnections = numCores * 5;

    console.log("The number of active connections is: ", numConnection);
    console.log("Memory usage is: ", memoryUsage / 1024 / 1024, "MB");

    if (numConnection > maxConnections) {
      console.log("Overload connections detected");
      // (send notification ...)
    }
  }, _SECONDS); // check every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
