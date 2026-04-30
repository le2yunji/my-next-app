const { togglePostLike } = require("../services/post/post-like.service");

async function toggleLike(req, res, next) {
  try {
    const { postId } = req.params;
    const userId = req.user.mongoId;

    const result = await togglePostLike({ postId, userId });

    if (!result.success) {
      const { code, message } = result.error ?? {};

      if (code === "INVALID_POST_ID" || code === "INVALID_USER_ID") {
        return res.status(400).json({ isError: true, code, message });
      }

      if (code === "POST_NOT_FOUND") {
        return res.status(404).json({ isError: true, code, message });
      }

      return res.status(500).json({
        isError: true,
        code: code ?? "UNKNOWN_ERROR",
        message: message ?? "좋아요 처리 중 오류가 발생했습니다.",
      });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    next(error);
  }
}

module.exports = { toggleLike };
