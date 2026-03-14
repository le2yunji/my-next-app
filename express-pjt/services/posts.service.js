// services/posts.service.js
const { POSTS } = require("../data/posts.data");

exports.findPostById = (postId) => {
  return POSTS.find((post) => post.id === postId) ?? null;
};
