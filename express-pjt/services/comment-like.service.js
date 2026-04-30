const mongoose = require("mongoose");
const { findCommentById } = require("../repositories/comment.repository");
const {
  existsCommentLike,
  createCommentLike,
  deleteCommentLike,
} = require("../repositories/comment-like.repository");
const Comment = require("../models/comment.model");
const { createNotificationIfAllowed } = require("./notification.service");

const isValidObjectId = (v) => mongoose.Types.ObjectId.isValid(v);

/**
 * 댓글 좋아요 토글
 * 반환: { success, data: { liked, likeCount } }
 */
const toggleCommentLike = async ({ commentId, postId, userId }) => {
  if (!isValidObjectId(commentId)) {
    return {
      success: false,
      error: {
        code: "INVALID_COMMENT_ID",
        message: "유효하지 않은 댓글 id입니다.",
      },
    };
  }
  if (!isValidObjectId(userId)) {
    return {
      success: false,
      error: {
        code: "INVALID_USER_ID",
        message: "유효하지 않은 사용자 id입니다.",
      },
    };
  }

  const comment = await findCommentById(commentId);
  if (!comment || comment.isDeleted) {
    return {
      success: false,
      error: {
        code: "COMMENT_NOT_FOUND",
        message: "존재하지 않는 댓글입니다.",
      },
    };
  }
  if (String(comment.postId) !== String(postId)) {
    return {
      success: false,
      error: {
        code: "COMMENT_POST_MISMATCH",
        message: "해당 게시물의 댓글이 아닙니다.",
      },
    };
  }

  const alreadyLiked = await existsCommentLike({ commentId, userId });

  if (alreadyLiked) {
    await deleteCommentLike({ commentId, userId });
    await Comment.updateOne({ _id: commentId }, { $inc: { likeCount: -1 } });
    return {
      success: true,
      data: {
        liked: false,
        likeCount: Math.max(0, (comment.likeCount ?? 0) - 1),
      },
    };
  }

  await createCommentLike({ commentId, userId });
  await Comment.updateOne({ _id: commentId }, { $inc: { likeCount: 1 } });

  // 좋아요 시에만 알림 (취소는 알림 없음)
  createNotificationIfAllowed({
    type: "COMMENT_LIKE",
    senderId: userId,
    recipientId: comment.authorId,
    targetId: commentId,
    targetType: "COMMENT",
  }).catch((err) => console.error("COMMENT_LIKE notification error:", err));

  return {
    success: true,
    data: { liked: true, likeCount: (comment.likeCount ?? 0) + 1 },
  };
};

module.exports = { toggleCommentLike };
