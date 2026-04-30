const Post = require("../models/post.model");

/** 
 * postId로 게시글 하나 조회
 - 댓글 작성, 좋아요 등 특정 게시글에 대한 액션 전에 "유효한 글인지" 확인할 때 서비스 레이어에서 호출
 */
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

/**
 * 게시물 등록
 */
const createPost = (postData) => {
  return Post.create(postData);
};

// likeCount 1 증가
const incrementPostLikeCount = (postId) => {
  return Post.updateOne({ _id: postId }, { $inc: { likeCount: 1 } });
};

// likeCount 1 감소 (0 미만 방지)
const decrementPostLikeCount = (postId) => {
  return Post.updateOne(
    { _id: postId, likeCount: { $gt: 0 } },
    { $inc: { likeCount: -1 } }
  );
};

module.exports = {
  findActivePostById,
  findActivePostsByAuthorId,
  createPost,
  incrementPostLikeCount,
  decrementPostLikeCount,
};
