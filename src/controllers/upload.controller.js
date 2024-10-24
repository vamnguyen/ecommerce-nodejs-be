"use strict";

const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromLocalS3 } = require("../services/upload.service");

class UploadController {
  uploadImageFromLocalS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    new SuccessResponse({
      message: "Image uploaded successfully.",
      metadata: await uploadImageFromLocalS3(file),
    }).send(res);
  };
}

module.exports = new UploadController();
