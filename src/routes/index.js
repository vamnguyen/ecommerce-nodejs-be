"use strict";

const express = require("express");
const router = express.Router();

// router.use("/", (req, res, next) => {
//   return res.status(200).json({
//     message: "Welcome to the BE-Nodejs Course!",
//   });
// });

router.use("/v1/api", require("./access"));

module.exports = router;
