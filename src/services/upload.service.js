"use strict";

// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const {
  s3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/s3.config");
const crypto = require("crypto");

const cloudfrontUrlDomain = process.env.CLOUDFRONT_URL_DOMAIN;

const uploadImageFromLocalS3 = async (file) => {
  try {
    const randomString = crypto.randomBytes(16).toString("hex");

    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${randomString}-${file.originalname}`,
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const response = await s3Client.send(putCommand);

    // *** s3 signed url ***
    // const getCommand = new GetObjectCommand({
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: `${randomString}-${file.originalname}`,
    // });
    // await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 }); // expires in 1 hour

    // *** cloudfront signer protect resource by sign url ***
    const signedUrl = getSignedUrl({
      url: `${cloudfrontUrlDomain}/${randomString}-${file.originalname}`,
      keyPairId: process.env.CLOUDFRONT_PUBLIC_KEY_ID,
      dateLessThan: new Date(Date.now() + 60 * 1000), // expires in 1 minute
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
    });

    return {
      signedUrl,
      response,
    };
  } catch (error) {
    console.error("Error uploading image to S3:", error);
  }
};

module.exports = {
  uploadImageFromLocalS3,
};
