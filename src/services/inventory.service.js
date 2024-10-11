"use strict";

const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repository");

class InventoryService {
  static async addStockToInventory({
    stock,
    product_id,
    shop_id,
    location = "HCM City, Vietnam",
  }) {
    const product = await getProductById(product_id);
    if (!product) {
      throw new BadRequestError("The product does not exist");
    }
    const query = {
        inventory_shop: shop_id,
        inventory_product_id: product_id,
      },
      updateSet = {
        $inc: {
          inventory_stock: stock,
        },
        $set: {
          inventory_location: location,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  }

  /*
    Query Orders [Users]
  */
  static async getOrdersByUser() {}

  /*
    Query Orders using id [Users]
  */
  static async getOneOrderByUser() {}

  /*
    Cancel Order [Users]
  */
  static async cancelOrderByUser() {}

  /*
    Update Orders Status [Shop | Admin]
  */
  static async updateOrderStatusByShop() {}
}

/*
  orders: [
    {
      orderId: ...,
      products: [
        {
          productId: ...,
          productName: ...,
          quantity: ...,
          price: ...,
        }
        {
          productId: ...,
          productName: ...,
          quantity: ...,
          price: ...,
        }
      ]
      totalAmount: ...,
    },
    {
      ...
    }
  ]
*/

module.exports = InventoryService;
