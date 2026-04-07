const Post = require("../models/post.model");

const findActivePostById = (postId) => {
  return Post.findOne({
    _id: postId,
    isDeleted: false,
  }).lean();
};

const increasePostCommentCount = (postId, amount = 1) => {
  return Post.updateOne({ _id: postId }, { $inc: { commentCount: amount } });
};

module.exports = {
  findActivePostById,
  increasePostCommentCount,
};
