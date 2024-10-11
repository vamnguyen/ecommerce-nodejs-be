"use strict";

const cartModel = require("../../models/cart.model");
const { convertToObjectIdMongodb } = require("../../utils");

const findCartById = async (cart_id) => {
  return await cartModel
    .findOne({ _id: convertToObjectIdMongodb(cart_id), cart_state: "active" })
    .lean();
};

module.exports = {
  findCartById,
};
