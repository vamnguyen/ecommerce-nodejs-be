"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
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

module.exports = {
  createTokenPair,
};
