const { getPostCommentsData } = require("../services/comments.service");
const { toCommentThreadResponse } = require("../mappers/comment.mapper");

async function getPostComments(req, res) {
  try {
    const { postId } = req.params;
    const parsed = parseInt(req.query.limit || "10", 10);
    const limit = Math.min(Number.isNaN(parsed) ? 10 : parsed, 50);
    const cursor = req.query.cursor || null;

    const result = await getPostCommentsData({
      postId,
      cursor,
      limit,
    });

    if (!result) {
      return res.status(500).json({
        isError: true,
        code: "COMMENTS_RESULT_EMPTY",
        message: "댓글 조회 결과가 없습니다.",
      });
    }

    if (!result.success) {
      const errorCode = result.error?.code;
      const errorMessage =
        result.error?.message ?? "댓글 조회 중 오류가 발생했습니다.";

      if (errorCode === "INVALID_POST_ID") {
        return res.status(400).json({
          isError: true,
          code: errorCode,
          message: errorMessage,
        });
      }

      if (errorCode === "POST_NOT_FOUND") {
        return res.status(404).json({
          isError: true,
          code: errorCode,
          message: errorMessage,
        });
      }

      return res.status(500).json({
        isError: true,
        code: errorCode ?? "COMMENTS_UNKNOWN_ERROR",
        message: errorMessage,
      });
    }

    const { items, pageInfo } = result.data;

    return res.status(200).json({
      isError: false,
      items: items.map(toCommentThreadResponse),
      nextCursor: pageInfo.nextCursor,
      hasNext: pageInfo.hasNext,
      limit: pageInfo.limit,
    });
  } catch (error) {
    console.error("getPostComments error:", error);

    return res.status(500).json({
      isError: true,
      code: "INTERNAL_SERVER_ERROR",
      message: "서버 에러가 발생했습니다.",
    });
  }
}

module.exports = {
  getPostComments,
};
