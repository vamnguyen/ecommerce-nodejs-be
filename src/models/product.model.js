"use strict";

const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumbnail: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_description: { type: String, required: true },
    product_slug: { type: String },
    product_category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_quantity: { type: Number, required: true },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    product_rating: {
      type: Number,
      required: true,
      default: 4.5,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
      set: (value) => Math.round(value * 10) / 10,
    },
    product_variant: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// define product category clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String, required: true },
    material: { type: String, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  {
    timestamps: true,
    collection: "clothes",
  }
);

// define product category electronics
const electronicsSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  {
    timestamps: true,
    collection: "electronics",
  }
);

// define product category furniture
const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String, required: true },
    material: { type: String, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  {
    timestamps: true,
    collection: "furniture",
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronics: model("Electronics", electronicsSchema),
  furniture: model("Furniture", furnitureSchema),
};
