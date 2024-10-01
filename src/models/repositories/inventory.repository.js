"use strict";

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

module.exports = {
  insertInventory,
};
