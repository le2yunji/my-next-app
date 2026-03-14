// controllers/posts.controller.js
const { findPostById } = require("../services/posts.service");

function getPostDetail(req, res) {
  try {
    const { postId } = req.params;

    const post = findPostById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "게시물을 찾을 수 없습니다.",
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("getPostDetail error:", error);

    return res.status(500).json({
      success: false,
      message: "서버 에러가 발생했습니다.",
    });
  }
}

module.exports = { getPostDetail };
