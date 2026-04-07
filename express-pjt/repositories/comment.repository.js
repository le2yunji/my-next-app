// repositories/comment.repository.js
const Comment = require("../models/comment.model");

// 특정 게시물의 댓글 전체 조회
const findCommentsByPostId = (postId) => {
  return Comment.find({ postId }).sort({ createdAt: 1, _id: 1 }).lean();
};

// 같은 게시물 안에서 "삭제되지 않은 부모 댓글" 1개 조회
const findActiveParentComment = ({ parentCommentId, postId }) => {
  return Comment.findOne({
    _id: parentCommentId,
    postId,
    isDeleted: false,
  }).lean();
};

// 댓글 문서 생성
const createCommentDoc = (data) => {
  return Comment.create(data);
};

// 부모 댓글의 replyCount 증가
const increaseCommentReplyCount = (commentId, amount = 1) => {
  return Comment.updateOne(
    { _id: commentId },
    { $inc: { replyCount: amount } }
  );
};

module.exports = {
  findCommentsByPostId,
  findActiveParentComment,
  createCommentDoc,
  increaseCommentReplyCount,
};
