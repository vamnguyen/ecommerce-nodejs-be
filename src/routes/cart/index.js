"use strict";

const router = require("express").Router();
const cartController = require("../../controllers/cart.controller");
const asyncHandler = require("../../helpers/asyncHandler");

router.get("", asyncHandler(cartController.getCart));
router.post("/create", asyncHandler(cartController.addToCart));
// router.put("/update", asyncHandler(cartController.updateCart));
router.delete("/delete", asyncHandler(cartController.deleteCartItem));

module.exports = router;
