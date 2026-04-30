const PostLike = require("../models/post-like.model");

// 특정 게시물의 좋아요 전체 목록 조회
const findPostLikes = (postId) => {
  return PostLike.find({ postId }).lean();
};

// 특정 유저의 해당 게시물 좋아요 여부 조회
const existsPostLike = ({ postId, userId }) => {
  return PostLike.exists({ postId, userId });
};

// 좋아요 생성
const createPostLike = ({ postId, userId }) => {
  return PostLike.create({ postId, userId });
};

// 좋아요 삭제
const deletePostLike = ({ postId, userId }) => {
  return PostLike.deleteOne({ postId, userId });
};

// 특정 유저가 좋아요한 postId Set 반환 (피드 목록 isLiked 배치 조회용)
const findLikedPostIdSet = async ({ userId, postIds }) => {
  const likes = await PostLike.find({ userId, postId: { $in: postIds } })
    .select("postId")
    .lean();
  return new Set(likes.map((l) => String(l.postId)));
};

module.exports = {
  findPostLikes,
  existsPostLike,
  createPostLike,
  deletePostLike,
  findLikedPostIdSet,
};
