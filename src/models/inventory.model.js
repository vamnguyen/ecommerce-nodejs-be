"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    inventory_product_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    inventory_location: { type: String, default: "unknown" },
    inventory_stock: {
      type: Number,
      required: true,
      default: 0,
    },
    inventory_shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    inventory_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
