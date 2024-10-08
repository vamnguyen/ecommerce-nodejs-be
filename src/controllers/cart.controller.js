"use strict";

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cartV2.service");

class CartController {
  getCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Cart get successfully",
      metadata: await CartService.getAllProductsInCart(req.query),
    }).send(res);
  };

  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Cart added successfully",
      metadata: await CartService.addProductToCart(req.body),
    }).send(res);
  };

  // updateCart = async (req, res, next) => {
  //   new SuccessResponse({
  //     message: "Cart updated successfully",
  //     metadata: await CartService.updateCart(req.body),
  //   }).send(res);
  // };

  deleteCartItem = async (req, res, next) => {
    new SuccessResponse({
      message: "Cart deleted successfully",
      metadata: await CartService.removeProductFromCart(req.body),
    }).send(res);
  };
}

module.exports = new CartController();
