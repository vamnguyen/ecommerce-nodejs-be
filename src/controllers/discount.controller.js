"use strict";

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  /**
   * @description Create discount code
   * @returns { JSON }
   */
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Discount Code created successfully",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shop_id: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get all discount code
   * @param { String } shop_id
   * @returns { JSON }
   */
  getAllDiscountCode = async (req, res, next) => {
    console.log(1);
    new SuccessResponse({
      message: "Discount Code fetched successfully",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shop_id: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Calculate discount amount
   * @param { String } discount_code
   * @param { String } shop_id
   * @param { String } user_id
   * @param { Array } products
   * @returns { JSON }
   */
  calculateDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Discount amount fetched successfully",
      metadata: await DiscountService.calculateDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  /**
   * @description Get products by discount code
   * @param { String } discount_code
   * @param { String } shop_id
   * @returns { JSON }
   */
  getProductsByDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Products fetched successfully",
      metadata: await DiscountService.getProductsByDiscountCode({
        ...req.query,
        shop_id: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
