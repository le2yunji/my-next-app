const mongoose = require("mongoose");
const { findActivePostById } = require("../../repositories/post.repository");
const {
  existsPostLike,
  createPostLike,
  deletePostLike,
} = require("../../repositories/post-like.repository");
const {
  incrementPostLikeCount,
  decrementPostLikeCount,
} = require("../../repositories/post.repository");
const { createNotificationIfAllowed } = require("../notification.service");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

/**
 * 좋아요 토글
 * - 이미 좋아요 상태면 취소, 아니면 추가
 * 반환: { success, data: { liked, likeCount } }
 */
const togglePostLike = async ({ postId, userId }) => {
  if (!isValidObjectId(postId)) {
    return {
      success: false,
      error: {
        code: "INVALID_POST_ID",
        message: "유효하지 않은 게시물 id입니다.",
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

  const post = await findActivePostById(postId);
  if (!post) {
    return {
      success: false,
      error: { code: "POST_NOT_FOUND", message: "존재하지 않는 게시물입니다." },
    };
  }

  const alreadyLiked = await existsPostLike({ postId, userId });

  if (alreadyLiked) {
    await deletePostLike({ postId, userId });
    await decrementPostLikeCount(postId);
    return {
      success: true,
      data: { liked: false, likeCount: Math.max(0, post.likeCount - 1) },
    };
  }

  await createPostLike({ postId, userId });
  await incrementPostLikeCount(postId);

  // 좋아요 시에만 알림 (취소는 알림 없음)
  createNotificationIfAllowed({
    type: "POST_LIKE",
    senderId: userId,
    recipientId: post.authorId,
    targetId: postId,
    targetType: "POST",
  }).catch((err) => console.error("POST_LIKE notification error:", err));

  return {
    success: true,
    data: { liked: true, likeCount: post.likeCount + 1 },
  };
};

module.exports = { togglePostLike };
