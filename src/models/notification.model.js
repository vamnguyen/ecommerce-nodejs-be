"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

/**
 * ORDER-001: Order successfully
 * ORDER-002: Order failed
 * PROMOTION-001: new promotion
 * SHOP-001: new product from shop -> user following shop
 */

const notificationSchema = new Schema(
  {
    notification_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      required: true,
    },
    notification_sender_id: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    notification_receiver_id: { type: Number, required: true },
    notification_content: { type: String, required: true },
    notification_options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
