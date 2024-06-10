"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

// Search products
router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);

// middleware for authentication apply to all routes below
router.use(authenticationV2);

// create a new product
router.post("/", asyncHandler(productController.createProduct));

// get all draft products for shop
router.get(
  "/drafts",
  asyncHandler(productController.getAllDraftsProductByShop)
);

// get all published products for shop
router.get(
  "/published",
  asyncHandler(productController.getAllPublishedProductByShop)
);

// publish product
router.post(
  "/publish/:product_id",
  asyncHandler(productController.publishProductByShop)
);

// unpublish product
router.post(
  "/unpublish/:product_id",
  asyncHandler(productController.unPublishProductByShop)
);

module.exports = router;
