"use strict";

const express = require("express");
const NotificationController = require("../../controllers/notification.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// Here not login yet

// Here login already
router.use(authenticationV2);

router.get("/", asyncHandler(NotificationController.listNotificationByUser));

module.exports = router;
