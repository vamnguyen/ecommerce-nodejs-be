"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  InternalServerError,
} = require("../core/error.response");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static login = async ({ email, password, refreshToken }) => {
    // validate email and password
    if (!email || !password) {
      throw new BadRequestError("Email and password are required!");
    }

    // check email existed?
    const foundShop = await shopModel.findOne({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registered!");
    }

    // compare password
    const isMatch = await bcrypt.compare(password, foundShop.password);
    if (!isMatch) {
      throw new BadRequestError("Authentication failed!");
    }

    // create privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // create token pair
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    // save privateKey, publicKey and refreshToken to Collection KeyStore
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        field: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // check email existed?
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Shop already registered!");
    }

    // create new shop
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // create privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      // save privateKey, publicKey to Collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("KeyStore failed!");
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        shop: getInfoData({
          field: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }

    // Create new shop failed
    throw new InternalServerError("Create new shop failed!");
  };
}

module.exports = AccessService;
