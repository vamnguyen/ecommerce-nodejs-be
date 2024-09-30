const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  /**
   * @description Create a new product
   * @param {Product} product
   * @return {JSON}
   */
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product created successfully",
      metadata: await ProductService.createProduct(req.body.product_category, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get all draft products for shop
   * @param { Number } limit
   * @param { Number } skip
   * @returns { JSON }
   */
  getAllDraftsProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Draft products retrieved successfully",
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Get all published products for shop
   * @param { Number } limit
   * @param { Number } skip
   * @returns { JSON }
   */
  getAllPublishedProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Published products retrieved successfully",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Publish product by shop
   * @param { String } product_id
   * @param { String } product_shop
   * @return { JSON }
   */
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product published successfully",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.product_id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Unpublish product by shop
   * @param { String } product_id
   * @param { String } product_shop
   * @return { JSON }
   */
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Product unpublished successfully",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.product_id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @description Search products
   * @param { String } keySearch
   * @returns { JSON }
   */
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Search products successfully",
      metadata: await ProductService.getListSearchProduct(req.params),
    }).send(res);
  };

  /**
   * @description Get all products
   * @returns { JSON }
   */
  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all products successfully",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  /**
   * @description Get product by id
   * @param { String } product_id
   * @returns { JSON }
   */
  findProductById = async (req, res, next) => {
    new SuccessResponse({
      message: "Get product successfully",
      metadata: await ProductService.findProductById(req.params.product_id),
    }).send(res);
  };

  /**
   * @description Update product
   * @param { String } product_category
   * @param { String } product_id
   * @param { Product } product
   * @returns { JSON }
   */
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product updated successfully",
      metadata: await ProductService.updateProduct(
        req.body.product_category,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
