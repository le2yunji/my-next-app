// repositories/comment.repository.js
const Comment = require("../models/comment.model");

// 특정 게시물의 댓글 전체 조회
const findCommentsByPostId = (postId) => {
  return Comment.find({ postId }).sort({ createdAt: 1, _id: 1 }).lean();
};

// 같은 게시물 안에서 부모 댓글 1개 조회
const findActiveParentComment = ({ parentCommentId, postId }) => {
  return Comment.findOne({
    _id: parentCommentId,
    postId,
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
    { $inc: { replyCount: amount } },
  );
};

// 단일 게시물의 댓글 수
const countCommentsByPostId = (postId) => {
  return Comment.countDocuments({ postId });
};

/**
 * 여러 게시물의 댓글 수를 한 번에 집계
 * 반환: { [postId 문자열]: count }
 */
const countCommentsByPostIds = async (postIds = []) => {
  const results = await Comment.aggregate([
    { $match: { postId: { $in: postIds } } },
    { $group: { _id: "$postId", count: { $sum: 1 } } },
  ]);
  return Object.fromEntries(results.map((r) => [String(r._id), r.count]));
};

const findCommentById = (commentId) => {
  return Comment.findById(commentId).lean();
};

const deleteCommentById = (commentId) => {
  return Comment.deleteOne({ _id: commentId });
};

// 특정 원댓글의 대댓글 전체 삭제
const deleteRepliesByParentId = (parentCommentId) => {
  return Comment.deleteMany({ parentCommentId });
};

const updateCommentContent = (commentId, content) => {
  return Comment.findOneAndUpdate(
    { _id: commentId },
    { $set: { content, updatedAt: new Date() } },
    { new: true },
  ).lean();
};

const decreaseCommentReplyCount = (commentId, amount = 1) => {
  return Comment.updateOne(
    { _id: commentId },
    { $inc: { replyCount: -amount } },
  );
};

module.exports = {
  findCommentsByPostId,
  findActiveParentComment,
  createCommentDoc,
  increaseCommentReplyCount,
  decreaseCommentReplyCount,
  countCommentsByPostId,
  countCommentsByPostIds,
  findCommentById,
  deleteCommentById,
  deleteRepliesByParentId,
  updateCommentContent,
};
