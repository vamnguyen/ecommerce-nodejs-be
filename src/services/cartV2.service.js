"use strict";

const cartModel = require("../models/cart.model");

class CartService {
  /// START REPO CART ///
  static async createUserCart({ user_id, products }) {
    const query = { cart_user_id: user_id, cart_state: "active" },
      updateOrInsert = {
        $addToSet: { cart_products: { $each: products } },
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateProductQuantityUserCart({ user_id, products }) {
    const bulkOperations = products.map((product) => {
      const { product_id, product_quantity } = product;
      return {
        updateOne: {
          filter: {
            cart_user_id: user_id,
            cart_state: "active",
            cart_products: { $elemMatch: { product_id } },
          },
          update: {
            $set: { "cart_products.$.product_quantity": product_quantity },
          },
          upsert: true,
        },
      };
    });

    return await cartModel.bulkWrite(bulkOperations);
  }
  /// END REPO CART ///

  static async getAllProductsInCart({ user_id }) {
    const userCart = await cartModel.findOne({
      cart_user_id: user_id,
      cart_state: "active",
    });

    if (!userCart) {
      return { message: "No active cart found for this user", products: [] };
    }

    return userCart.cart_products;
  }

  /**
   * @example {
    "user_id": 1111,
    "products": [
      {
        "product_id": "657ac36c670cf14550275c6b",
        "shop_id": "65539fc92500bf661e4aafda",
        "product_quantity": 5
      }
      {
        "product_id": "657ac36c670cf14550275c6b",
        "shop_id": "65539fc92500bf661e4aafda",
        "product_quantity": 10
      }
    ]
   */
  static async addProductToCart({ user_id, products = [] }) {
    // Check for duplicates before proceeding
    const productIds = products.map((p) => p.product_id);
    const hasDuplicates = new Set(productIds).size !== productIds.length;

    if (hasDuplicates) {
      throw new Error("Duplicate product_id detected in products array.");
    }

    // Check if the user has a cart
    let userCart = await cartModel.findOne({ cart_user_id: user_id });
    if (!userCart) {
      return await CartService.createUserCart({ user_id, products });
    }

    // Separate products into existing and new
    const existingProducts = [];
    const newProducts = [];

    for (const product of products) {
      const existingProduct = userCart.cart_products.find(
        (p) => p.product_id === product.product_id
      );
      if (existingProduct) {
        existingProducts.push(product);
      } else {
        newProducts.push(product);
      }
    }

    // Update quantities of existing products
    if (existingProducts.length > 0) {
      await CartService.updateProductQuantityUserCart({
        user_id,
        products: existingProducts,
      });
    }

    // Add new products to the cart
    if (newProducts.length > 0) {
      userCart.cart_products.push(...newProducts);
      await userCart.save();
    }

    // Fetch the updated cart
    userCart = await cartModel.findOne({ cart_user_id: user_id });

    return userCart;
  }

  static async removeProductFromCart({ user_id, product_ids }) {
    return await cartModel.updateOne(
      { cart_user_id: user_id, cart_state: "active" },
      { $pull: { cart_products: { product_id: { $in: product_ids } } } }
    );
  }
}

module.exports = CartService;
