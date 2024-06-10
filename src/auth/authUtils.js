"use strict";

const JWT = require("jsonwebtoken");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");
const asyncHandler = require("../helpers/asyncHandler");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log(`Error verify::`, err);
      } else {
        console.log(`Decoded verify::`, decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  // check userId missing?
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request!");

  // check keyStore
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("KeyStore not found!");

  // check accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request!");

  try {
    const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodedUser.userId)
      throw new AuthFailureError("Invalid userId!");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request!");

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore!");

  // if has refresh token
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid UserId!");

      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;

      return next();
    } catch (error) {
      throw error;
    }
  }

  // if has not refresh token then check access token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request!");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid UserId!");

    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, key) => {
  return JWT.verify(token, key);
};

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT,
};
