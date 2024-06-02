"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  InternalServerError,
  ForbiddenError,
  AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
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

  static login = async ({ email, password, refreshToken = null }) => {
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

  static logout = async (keyStore) => {
    // delete Document in Collection KeyStore
    return await KeyTokenService.removeTokenById(keyStore._id);
  };

  static handlerRefreshToken = async (refreshToken) => {
    // check refreshToken used?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      // decode refreshToken to get userId, email
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something went wrong!");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Invalid refresh token!");

    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    const foundShop = await findByEmail(email);
    if (!foundShop) throw new AuthFailureError("Shop not registered");

    const tokens = await createTokenPair(
      { userId, email },
      holderToken.privateKey,
      holderToken.publicKey
    );

    // update accessToken, refreshToken in Collection KeyStore of user
    await holderToken.updateOne({
      $set: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      $addToSet: { refreshTokensUsed: refreshToken },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    let { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something went wrong! Please login again!");
    }
    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not registered!");
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered!");
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.privateKey,
      keyStore.publicKey
    );

    await keyStore.updateOne({
      $set: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      $addToSet: { refreshTokensUsed: refreshToken },
    });
    return {
      user,
      tokens,
    };
  };
}

module.exports = AccessService;
