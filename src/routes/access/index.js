"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");

// Sign Up
router.post("/shop/sign-up", asyncHandler(accessController.signUp));

module.exports = router;
