"use strict";

const { Types } = require("mongoose");
const { product } = require("../product.model");
const { BadRequestError } = require("../../core/error.response");
const {
  getSelectData,
  unSelectData,
  convertToObjectIdMongodb,
} = require("../../utils");

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

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id, unselect }) => {
  return await product
    .findOne({ _id: product_id })
    .select(unSelectData(unselect))
    .lean();
};

const updateProductById = async ({
  product_id,
  body_update,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(product_id, body_update, { new: isNew });
};

const getProductById = async (product_id) => {
  return await product
    .findOne({ _id: convertToObjectIdMongodb(product_id) })
    .lean();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.product_id);
      if (foundProduct) {
        return {
          product_price: foundProduct.product_price,
          product_quantity: product.product_quantity,
          product_id: product.product_id,
        };
      }
    })
  );
};

const checkProductExist = async ({ product_id }) => {
  const foundProduct = await product.exists({
    _id: convertToObjectIdMongodb(product_id),
  });
  if (!foundProduct) throw new NotFoundError("Product not found");
};

module.exports = {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProducts,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer,
  checkProductExist,
};
