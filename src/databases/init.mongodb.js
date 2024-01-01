"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");

const connectString = `mongodb://localhost:27017/shopDEV`;

// Singleton Pattern
class Database {
  constructor() {
    this.connect();
  }

  // connect to mongodb method
  connect(type = "mongodb") {
    // log mongoose queries in development
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        countConnect();
        console.log("Connected MongoDB Successfully");
      })
      .catch((err) => console.log(`Error Connecting MongoDB: ${err}`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;
