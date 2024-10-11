"use strict";

const {
  findAllProducts,
} = require("../models/repositories/product.repository");
const discountModel = require("../models/discount.model");
const {
  findDiscount,
  findAllDiscountCodesSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repository");
const { convertToObjectIdMongodb, removeUndefinedData } = require("../utils");
const { BadRequestError, NotFoundError } = require("../core/error.response");

/**
 * * Discount Service
 * @description CRUD Service for Discount
 * 1. Generator discount code [Shop | Admin]
 * 2. Get discount amount [User]
 * 3. Get all discount code [User | Shop]
 * 4. Verify discount code [User]
 * 5. Delete discount code [Shop | Admin]
 * 6. Cancel discount code [User]
 */
class DiscountService {
  static async createDiscountCode(body) {
    const {
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_shop_id,
    } = removeUndefinedData(body);
    if (new Date() > new Date(discount_end_date)) {
      throw new BadRequestError("Discount end date cannot be in the past");
    }
    if (new Date(discount_start_date) > new Date(discount_end_date)) {
      throw new BadRequestError("Start date cannot be greater than end date");
    }

    const foundDiscount = await findDiscount({
      discount_code,
      discount_shop_id,
    });
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists");
    }

    const newDiscount = await discountModel.create({
      ...body,
    });
    return newDiscount;
  }

  static async getProductsByDiscountCode({
    discount_code,
    shop_id,
    limit,
    page,
  }) {
    const foundDiscount = await findDiscount({ discount_code, shop_id });
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not exists");
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let products;
    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: { product_shop: shop_id, isPublished: true },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: { _id: { $in: discount_product_ids }, isPublished: true },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, shop_id }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: convertToObjectIdMongodb(shop_id),
        discount_is_active: true,
      },
      select: ["discount_name", "discount_code"],
      model: discountModel,
    });
    return discounts;
  }

  /**
   * getDiscountAmount
   */
  static async calculateDiscountAmount({
    discount_code,
    user_id,
    shop_id,
    products,
  }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code,
        discount_shop_id: convertToObjectIdMongodb(shop_id),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError(`Discount code: ${discount_code} not found`);
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_amount,
      discount_users_using,
      discount_type,
      discount_value,
      discount_max_uses_per_user,
      discount_product_ids,
    } = foundDiscount;
    if (!discount_is_active) {
      throw new NotFoundError("Discount code has expired");
    }
    if (!discount_max_uses) {
      throw new NotFoundError("Discount code has been used up");
    }
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError("Discount code has expired");
    }

    const listProduct = products.filter((element) =>
      discount_product_ids.includes(element.product_id)
    );

    let total_order = 0;
    if (discount_min_order_amount > 0) {
      total_order = listProduct.reduce((acc, cur) => {
        return acc + cur.product_price * cur.product_quantity;
      }, 0);
    }
    if (total_order < discount_min_order_amount) {
      throw new BadRequestError(
        `Minimum order amount is ${discount_min_order_amount}`
      );
    }

    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_using.find((id) => id === user_id);
      if (userDiscount) {
        throw new BadRequestError("You have used up this discount code");
      }
    }

    // Calculate discount amount
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : total_order * (discount_value / 100);

    return {
      total_order,
      discount_amount: amount,
      total_price: total_order - amount,
    };
  }

  static async deleteDiscountCode({ shop_id, discount_code }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code,
      discount_shop: convertToObjectIdMongodb(shop_id),
    });
    return deleted;
  }

  static async cancelDiscountCode({ discount_code, shop_id, user_id }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code,
        discount_shop_id: convertToObjectIdMongodb(shop_id),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError(`Discount code ${discount_code} not found`);
    }

    const canceledDiscount = await discountModel.findByIdAndUpdate(
      foundDiscount._id,
      {
        $pull: { discount_users_using: user_id },
        $inc: {
          discount_max_uses: 1,
          discount_uses_count: -1,
        },
      }
    );
    return canceledDiscount;
  }
}

module.exports = DiscountService;
