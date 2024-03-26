"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");

// Sign Up
router.post("/shop/sign-up", accessController.signUp);

module.exports = router;
