"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const inventoryModel = require("../inventory.model");
const { Types } = require("mongoose");

const insertInventory = async ({
  product_id,
  shop_id,
  quantity,
  location = "unknown",
}) => {
  return await inventoryModel.create({
    inventory_product_id: product_id,
    inventory_shop: shop_id,
    inventory_stock: quantity,
    inventory_location: location,
  });
};

const reservationInventory = async ({
  product_id,
  product_quantity,
  cart_id,
}) => {
  const query = {
      inventory_product_id: convertToObjectIdMongodb(product_id),
      inventory_stock: { $gte: product_quantity },
    },
    updateSet = {
      $inc: {
        inventory_stock: -product_quantity,
      },
      $push: {
        inventory_reservations: {
          product_quantity,
          cart_id,
          createOn: new Date(),
        },
      },
    },
    options = {
      upsert: true,
      new: true,
    };
  return await inventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
