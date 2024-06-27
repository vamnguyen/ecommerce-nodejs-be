"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  clothing,
  product,
  electronics,
  furniture,
} = require("../models/product.model");
const {
  findAllDraftForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishForShop,
  searchProducts,
  findAllProducts,
  findProduct,
} = require("../models/repositories/product.repository");

class ProductService {
  static productRegistry = {}; // key: value (category: class)
  // register product category
  static registerProductCategory(category, classRef) {
    ProductService.productRegistry[category] = classRef;
  }

  // CREATE
  static async createProduct(category, payload) {
    const productClass = ProductService.productRegistry[category];
    if (!productClass) throw new BadRequestError("Invalid product category");

    return new productClass(payload).createProduct();
  }

  // POST (UPDATE)
  static async publishProductByShop({ product_id, product_shop }) {
    return await publishProductByShop({ product_id, product_shop });
  }

  static async unPublishProductByShop({ product_id, product_shop }) {
    return await unPublishProductByShop({ product_id, product_shop });
  }

  // QUERY
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async getListSearchProduct({ keySearch }) {
    return await searchProducts({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: [
        "product_name",
        "product_price",
        "product_thumbnail",
        "product_shop",
      ],
    });
  }

  static async findProductById(product_id) {
    return await findProduct({ product_id, unselect: ["__v"] });
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumbnail,
    product_price,
    product_description,
    product_category,
    product_quantity,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumbnail = product_thumbnail;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_category = product_category;
    this.product_quantity = product_quantity;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({
      ...this,
      _id: product_id,
    });

    return newProduct;
  }
}

// define sub-class for different product categories (clothing, electronics, furniture, etc.)
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this,
      product_shop: this.product_shop,
    });

    if (!newClothing)
      throw new BadRequestError("Clothing could not be created");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Product could not be created");

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronics)
      throw new BadRequestError("Electronics could not be created");

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestError("Product could not be created");
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture)
      throw new BadRequestError("Furniture could not be created");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Product could not be created");
    return newProduct;
  }
}

// register product categories
ProductService.registerProductCategory("Clothing", Clothing);
ProductService.registerProductCategory("Electronics", Electronics);
ProductService.registerProductCategory("Furniture", Furniture);

module.exports = ProductService;
