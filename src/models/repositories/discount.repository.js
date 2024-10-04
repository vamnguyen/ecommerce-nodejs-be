"use strict";

const discountModel = require("../discount.model");
const {
  convertToObjectIdMongodb,
  getSelectData,
  unSelectData,
} = require("../../utils");

/**
 * Find discount code
 * @param {Object} { discount_code, shop_id }
 * @returns {Promise}
 */
const findDiscount = async ({ discount_code, shop_id }) => {
  return await discountModel
    .findOne({
      discount_code,
      discount_shop_id: convertToObjectIdMongodb(shop_id),
    })
    .lean();
};

/**
 * Find all discount codes with unselect data
 * @param {Object} { limit, page, sort, filter, unselect, model }
 * @returns {Promise}
 */
const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unselect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unSelectData(unselect))
    .lean();
  return documents;
};

/**
 * Check discount code exists
 * @param {Object} { model, filter }
 * @returns {Promise}
 */
const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};

/**
 * Find all discount codes with select data
 * @param {Object} { limit, page, sort, filter, select, model }
 * @returns {Promise}
 */
const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return documents;
};

module.exports = {
  findDiscount,
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
};
