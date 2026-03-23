const {
  POSTS,
  POST_MEDIA_MAP,
  POST_LIKE_MAP,
  COMMENT_MAP,
} = require("../mocks/posts.mock");

// 게시물 한 개 찾기
const getPostById = (postId) =>
  POSTS.find((post) => post.id === postId) || null;

// 게시물의 이미지 목록 찾기
const getMediaByPostId = (postId) => POST_MEDIA_MAP[postId] || [];

// 게시물의 좋아요 목록 찾기
const getLikesByPostId = (postId) => POST_LIKE_MAP[postId] || [];

// 게시물의 댓글 목록 찾기
const getCommentsByPostId = (postId) => COMMENT_MAP[postId] || [];

module.exports = {
  getPostById,
  getMediaByPostId,
  getLikesByPostId,
  getCommentsByPostId,
};
