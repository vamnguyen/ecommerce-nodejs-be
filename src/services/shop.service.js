const shopModel = require("../models/shop.model");

const findByEmail = async (email) => {
  return await shopModel
    .findOne({ email })
    .select({ email: 1, password: 2, name: 1, status: 1, roles: 1 })
    .lean();
};

module.exports = { findByEmail };
