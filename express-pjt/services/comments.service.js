// services/comments.service.js

const { getUserById } = require("../selectors/user.selectors");
const {
  getPostById,
  getCommentsByPostId,
} = require("../selectors/post.selectors");
const { paginateByCursor } = require("../utils/pagination");

// 댓글 시간순 정렬
const sortCommentsByCreatedAtAsc = (items = []) => {
  return [...items].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

// 게시물 댓글 목록 raw data 조회
const getPostCommentsData = ({ postId, cursor = null, limit = 10 }) => {
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

  const allComments = sortCommentsByCreatedAtAsc(getCommentsByPostId(postId));

  const { pagedItems, pageInfo } = paginateByCursor({
    items: allComments,
    cursor,
    limit,
  });

  const commentsWithAuthor = pagedItems
    .map((comment) => {
      const author = getUserById(comment.authorId);
      if (!author) return null;

      return {
        comment,
        author,
      };
    })
    .filter(Boolean);

  return {
    success: true,
    data: {
      items: commentsWithAuthor,
      pageInfo,
    },
  };
};

module.exports = {
  getPostCommentsData,
};
