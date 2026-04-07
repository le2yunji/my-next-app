// models/post-like.model.js
const mongoose = require("mongoose");

const postLikeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 한 유저가 같은 게시물에 좋아요를 중복으로 못 누르게 함
postLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("PostLike", postLikeSchema);
