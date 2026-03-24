// services/post-detail-base.service.js
const { getUserById } = require("../selectors/user.selectors");
const {
  getPostById,
  getMediaByPostId,
  getLikesByPostId,
  getCommentsByPostId,
} = require("../selectors/post.selectors");

// 이미지 순서 정렬
const sortByOrderAsc = (items) => {
  return [...items].sort((a, b) => a.order - b.order);
};
// 게시물 상세에 필요한 raw data 조합
const buildPostDetailBase = ({ postId, viewerId = null }) => {
  const post = getPostById(postId);
  if (!post) {
    return {
      success: false,
      error: {
        code: "POST_NOT_FOUND",
        message: "존재하지 않는 게시물입니다.",
      },
    };
  }

  const author = getUserById(post.authorId);

  if (!author) {
    return {
      success: false,
      error: {
        code: "AUTHOR_NOT_FOUND",
        message: "게시물 작성자 정보를 찾을 수 없습니다.",
      },
    };
  }

  const mediaList = sortByOrderAsc(getMediaByPostId(post.id)); // 게시물 이미지 목록
  const likeList = getLikesByPostId(post.id) ?? []; // 좋아요 누른 유저들 목록

  const likedByMe = viewerId
    ? likeList.some((like) => like.userId === viewerId)
    : false;

  const comments = getCommentsByPostId(post.id) ?? null;

  return {
    success: true,
    data: {
      post,
      author,
      mediaList,
      likedByMe,
      comments,
    },
  };
};

module.exports = {
  buildPostDetailBase,
};
