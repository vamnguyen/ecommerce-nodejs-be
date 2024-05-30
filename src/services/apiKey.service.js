"use strict";

const apiKeyModel = require("../models/apiKey.model");

const findByKey = async (key) => {
  const objKey = await apiKeyModel
    .findOne({
      key,
      status: true,
    })
    .lean();

  return objKey;
};

module.exports = {
  findByKey,
};
