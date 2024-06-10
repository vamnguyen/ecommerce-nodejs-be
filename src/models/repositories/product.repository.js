"use strict";

const { Types } = require("mongoose");
const { product } = require("../product.model");
const { BadRequestError } = require("../../core/error.response");

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
};

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_id, product_shop }) => {
  const foundProduct = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  });

  if (!foundProduct) throw new BadRequestError("Invalid product");

  // found product -> update isDraft to false and isPublished to true
  foundProduct.isDraft = false;
  foundProduct.isPublished = true;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundProduct) throw new BadRequestError("Invalid product");
  foundProduct.isDraft = true;
  foundProduct.isPublished = false;
  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const searchProducts = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return result;
};

module.exports = {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProducts,
};
