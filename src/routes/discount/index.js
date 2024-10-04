"use strict";

const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");

const router = express.Router();

router.post(
  "/amount",
  asyncHandler(discountController.calculateDiscountAmount)
);

router.use(authenticationV2);

router.get(
  "/list_product_code",
  asyncHandler(discountController.getProductsByDiscountCode)
);
router.post("/create", asyncHandler(discountController.createDiscountCode));
router.get("", asyncHandler(discountController.getAllDiscountCode));

module.exports = router;
