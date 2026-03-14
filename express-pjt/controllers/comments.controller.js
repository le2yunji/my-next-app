const { getCommentsByPostId } = require("../services/comments.service");

function getComment(req, res) {
  try {
    const { postId } = req.params;
    const comment = getCommentsByPostId(postId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "댓글을 찾을 수 없습니다.",
      });
    }
    return res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error("getComment error:", error);

    return res.status(500).json({
      success: false,
      message: "서버 에러가 발생했습니다.",
    });
  }
}
module.exports = { getComment };
