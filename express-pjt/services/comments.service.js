// services/comments.service.js
const { COMMENTS } = require("../data/comments.data");

exports.getCommentsByPostId = (postId) => {
  return COMMENTS.filter((comment) => comment.postId === postId);
};
