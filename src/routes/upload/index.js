"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const uploadController = require("../../controllers/upload.controller");
const { uploadMemory } = require("../../configs/multer.config");

router.post(
  "/bucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadImageFromLocalS3)
);

module.exports = router;
