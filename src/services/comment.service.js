"use strict";

const { NotFoundError } = require("../core/error.response");
const Comment = require("../models/comment.model");
const {
  findProduct,
  checkProductExist,
} = require("../models/repositories/product.repository");
const { convertToObjectIdMongodb } = require("../utils");

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    await checkProductExist({ product_id: productId });

    const comment = new Comment({
      comment_product_id: productId,
      comment_user_id: userId,
      comment_content: content,
      comment_parent_id: parentCommentId,
    });

    let rightValue;

    if (parentCommentId) {
      // reply comment
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundError("Parent comment not found");
      }

      rightValue = parentComment.comment_right;

      // update many comment
      // increase right value of all comments that have right value greater than or equal to right value of parent comment
      await Comment.updateMany(
        {
          comment_product_id: convertToObjectIdMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: {
            comment_right: 2,
          },
        }
      );

      // increase left value of all comments that have left value greater than right value of parent comment
      await Comment.updateMany(
        {
          comment_product_id: convertToObjectIdMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: {
            comment_left: 2,
          },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_product_id: convertToObjectIdMongodb(productId),
        },
        "comment_right",
        {
          sort: {
            comment_right: -1,
          },
        }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // insert to comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, //skip
  }) {
    await checkProductExist({ product_id: productId });

    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Not found comment for product");

      const comments = await Comment.find({
        comment_product_id: convertToObjectIdMongodb(productId),
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lt: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parent_id: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }

    // get all comments of product if parentCommentId is null
    const comments = await Comment.find({
      comment_product_id: convertToObjectIdMongodb(productId),
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parent_id: 1,
      })
      .sort({
        comment_left: 1,
      });

    return comments;
  }

  static async deleteComment({ commentId, productId }) {
    await checkProductExist({ product_id: productId });

    const comment = await Comment.findById(commentId);
    if (!comment) throw new NotFoundError("Comment not found");

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;
    const width = rightValue - leftValue + 1;

    await Comment.deleteMany({
      comment_product_id: convertToObjectIdMongodb(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    // update many comment left and right value
    await Comment.updateMany(
      {
        comment_product_id: convertToObjectIdMongodb(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: {
          comment_left: -width,
        },
      }
    );

    await Comment.updateMany(
      {
        comment_product_id: convertToObjectIdMongodb(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: {
          comment_right: -width,
        },
      }
    );

    return true;
  }
}

module.exports = CommentService;
