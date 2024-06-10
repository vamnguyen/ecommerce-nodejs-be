"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

router.use("/api/test", (req, res) => {
  res.json({
    status: "success",
    message: "Welcome to API",
  });
});

// check api key
router.use(apiKey);
// check permission
router.use(permission("0000"));

router.use("/v1/api/auth", require("./access"));
router.use("/v1/api/product", require("./product"));

module.exports = router;
