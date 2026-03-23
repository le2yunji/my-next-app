// controllers/comments.controller.js
const { getPostCommentsData } = require("../services/comments.service");
const { toCommentResponse } = require("../mappers/post-detail.mapper");

function getPostComments(req, res) {
  try {
    const { postId } = req.params;

    const parsed = parseInt(req.query.limit || "10", 10);
    const limit = Math.min(Number.isNaN(parsed) ? 10 : parsed, 50);
    const cursor = req.query.cursor || null;

    const result = getPostCommentsData({
      postId,
      cursor,
      limit,
    });

    if (!result.success) {
      if (result.error.code === "POST_NOT_FOUND") {
        return res.status(404).json(result.error);
      }

      return res.status(400).json(result.error);
    }

    const { items, pageInfo } = result.data;

    return res.status(200).json({
      items: items.map(({ comment, author }) =>
        toCommentResponse({ comment, author })
      ),
      nextCursor: pageInfo.nextCursor,
      hasNext: pageInfo.hasNext,
    });
  } catch (error) {
    console.error("getPostComments error:", error);

    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "서버 에러가 발생했습니다.",
    });
  }
}

module.exports = { getPostComments };
