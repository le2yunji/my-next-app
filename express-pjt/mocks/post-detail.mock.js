const { POSTS } = require("./posts.mock");
const { COMMENTS } = require("../data/comments.data");

function getPostDetailResponse(postId) {
  const post = POSTS.find((item) => item.id === postId);
  if (!post) return null;

  const comments = COMMENTS.filter((item) => item.postId === postId);

  return {
    success: true,
    data: {
      ...post,
      comments,
    },
  };
}

module.exports = { getPostDetailResponse };
