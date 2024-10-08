"use strict";

const { getProductById } = require("../models/repositories/product.repository");
const cartModel = require("../models/cart.model");
const { NotFoundError } = require("../core/error.response");

class CartService {
  /// START REPO CART ///
  static async createUserCart({ user_id, product }) {
    const query = { cart_user_id: user_id, cart_state: "active" },
      updateOrInsert = {
        $addToSet: { cart_products: product },
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateProductQuantityUserCart({ user_id, product }) {
    const { product_id, product_quantity } = product;
    const query = {
        cart_user_id: user_id,
        "cart_products.product_id": product_id,
        cart_state: "active",
      },
      updateSet = {
        $inc: { "cart_products.$.product_quantity": product_quantity }, // ($ = product_id)
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }
  /// END REPO CART ///

  /**
   * @example {
    "user_id": 1111,
    "products": [
      {
        "product_id": "657ac36c670cf14550275c6b",
        "shop_id": "65539fc92500bf661e4aafda",
        "product_quantity": 4,
        "name": "",
        "product_price": 111
      }
    ]
   */
  static async addProductToCart({ user_id, product = {} }) {
    // Check if the user has a cart
    const userCart = await cartModel.findOne({ cart_user_id: user_id });
    if (!userCart) {
      return await CartService.createUserCart({ user_id, product });
    }

    // Check if cart has not products
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // Check if the product is already in the cart and update the quantity
    return await CartService.updateProductQuantityUserCart({
      user_id,
      product,
    });
  }

  // update cart
  /*
    user_id: 1001,
    shop_order_ids: [
      {
        shop_id: "60f9d4e8e0b6b5a9d8b4a2b0",
        item_product: [
          {
            product_id: "60f9d4e8e0b6b5a9d8b4a2b1",
            product_price: 100,
            product_quantity: 1,
            old_quantity: 1,
          },
        ],
      },
    ]
  */
  static async updateCart({ user_id, shop_order_ids }) {
    const { product_id, product_quantity, old_quantity } =
      shop_order_ids[0]?.item_product[0];

    const foundProduct = await getProductById(product_id);
    if (!foundProduct) throw new NotFoundError("Product not found");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shop_id) {
      throw new NotFoundError("Product not found in this shop");
    }

    if (product_quantity === 0 || product_quantity < 0) {
      return await CartService.deleteUserCartItem({ user_id, product_id });
    }

    return await CartService.updateProductQuantityUserCart({
      user_id,
      product: {
        product_id,
        product_quantity: product_quantity - old_quantity,
      },
    });
  }

  static async deleteUserCartItem({ user_id, product_id }) {
    const query = { cart_user_id: user_id, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            product_id,
          },
        },
      };
    const deletedCart = await cartModel.updateOne(query, updateSet);
    return deletedCart;
  }

  static async getListUserCart({ user_id }) {
    return await cartModel
      .findOne({
        cart_user_id: user_id,
      })
      .lean();
  }
}

module.exports = CartService;
