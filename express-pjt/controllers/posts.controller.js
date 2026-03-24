// controllers/posts.controller.js
const {
  getUserPostDetailPageData,
} = require("../services/post-detail.service");
const {
  toUserPostDetailPageResponse,
} = require("../mappers/post-detail.mapper");

function getPostDetail(req, res) {
  try {
    const { userId, postId } = req.params;
    const viewerId = req.user?.id ?? null;

    const result = getUserPostDetailPageData({ userId, postId, viewerId });

    if (!result.success) {
      if (
        result.error.code === "USER_NOT_FOUND" ||
        result.error.code === "POST_NOT_FOUND" ||
        result.error.code === "AUTHOR_NOT_FOUND"
      ) {
        return res.status(404).json(result.error);
      }

      return res.status(400).json(result.error);
    }

    const {
      profile,
      post,
      author,
      mediaList,
      likedByMe,
      previewComment,
      previewCommentAuthor,
      navigation,
    } = result.data;

    return res.status(200).json(
      toUserPostDetailPageResponse({
        profile,
        post,
        author,
        mediaList,
        likedByMe,
        previewComment,
        previewCommentAuthor,
        navigation,
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
