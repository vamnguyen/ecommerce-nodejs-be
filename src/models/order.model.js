"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    order_user_id: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
      order_checkout: {
        totalPrice,
        totalApplyDiscount,
        freShip
      }
    */
    order_shipping: { type: Object, default: {} },
    /*
      order_shipping: {
        street,
        city,
        state,
        country
    }
    */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_tracking_number: { type: String, default: "#000011102024" },
    order_status: {
      type: String,
      enum: ["PENDING", "SHIPPING", "DELIVERED", "CANCELED", "CONFIRMED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
