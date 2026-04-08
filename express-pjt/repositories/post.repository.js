const Post = require("../models/post.model");

const findActivePostById = (postId) => {
  return Post.findOne({
    _id: postId,
    isDeleted: false,
  }).lean();
};

/**
 * 특정 작성자의 활성 게시물 전체 조회
 * - authorId는 User._id 기준
 * - 최신순 정렬
 */
const findActivePostsByAuthorId = (authorId) => {
  return Post.find({
    authorId,
    isDeleted: false,
  })
    .sort({ createdAt: -1, _id: -1 })
    .lean();
};

const increasePostCommentCount = (postId, amount = 1) => {
  return Post.updateOne({ _id: postId }, { $inc: { commentCount: amount } });
};

module.exports = {
  findActivePostById,
  findActivePostsByAuthorId,
  increasePostCommentCount,
};
