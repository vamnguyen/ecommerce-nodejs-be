const express = require("express");
const router = express.Router();
const commentController = require("../../controllers/comment.controller");
const { authenticationV2 } = require("../../auth/authUtils");

// start authentication //
router.use(authenticationV2);
// end authentication //

router.post("/create", commentController.createComment);
router.get("", commentController.getCommentsByParentId);
router.delete("/delete", commentController.deleteComment);

module.exports = router;
