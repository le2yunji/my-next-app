// controllers/posts.controller.js
const { getPostDetailData } = require("../services/post-detail.service");
const { toPostDetailResponse } = require("../mappers/post-detail.mapper");

function getPostDetail(req, res) {
  try {
    const { postId } = req.params;
    const viewerId = req.user?.id ?? null;

    const result = getPostDetailData({ postId, viewerId });

    if (!result.success) {
      if (result.error.code === "POST_NOT_FOUND") {
        return res.status(404).json(result.error);
      }

      return res.status(400).json(result.error);
    }

    const { post, author, mediaList, likedByMe, comments } = result.data;

    return res.status(200).json(
      toPostDetailResponse({
        post,
        author,
        mediaList,
        likedByMe,
      })
    );
  } catch (error) {
    console.error("getPostDetail error:", error);

    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      message: "서버 에러가 발생했습니다.",
    });
  }
}

module.exports = { getPostDetail };
