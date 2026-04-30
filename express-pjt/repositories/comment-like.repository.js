const CommentLike = require("../models/comment-like.model");

const existsCommentLike = ({ commentId, userId }) => {
  return CommentLike.exists({ commentId, userId });
};

const createCommentLike = ({ commentId, userId }) => {
  return CommentLike.create({ commentId, userId });
};

const deleteCommentLike = ({ commentId, userId }) => {
  return CommentLike.deleteOne({ commentId, userId });
};

// 피드 목록 등에서 여러 댓글의 isLiked를 한 번에 조회
const findLikedCommentIdSet = async ({ userId, commentIds }) => {
  const likes = await CommentLike.find({
    userId,
    commentId: { $in: commentIds },
  })
    .select("commentId")
    .lean();
  return new Set(likes.map((l) => String(l.commentId)));
};

module.exports = {
  existsCommentLike,
  createCommentLike,
  deleteCommentLike,
  findLikedCommentIdSet,
};
