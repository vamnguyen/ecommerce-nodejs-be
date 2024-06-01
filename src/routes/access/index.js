"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");

router.post("/shop/sign-up", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

module.exports = router;
