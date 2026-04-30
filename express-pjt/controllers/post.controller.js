const {
  getUserPostDetailPageData,
} = require("../services/post/post-detail.service");
const { createPostData } = require("../services/post/post-create.service");

async function getPostDetail(req, res, next) {
  try {
    const { userId, postId } = req.params;
    const viewerId = req.user?.mongoId ?? null;

    const result = await getUserPostDetailPageData({
      userId,
      postId,
      viewerId,
    });

    // result 자체가 없으면 서버 내부 오류로 처리
    if (!result) {
      return res.status(500).json({
        isError: true,
        message: "게시물 상세 조회 결과가 없습니다.",
      });
    }

    // 실패 응답 처리
    if (!result.success) {
      const errorCode = result.error?.code;

      if (errorCode === "INVALID_USER_ID" || errorCode === "INVALID_POST_ID") {
        return res.status(400).json({
          isError: true,
          code: errorCode,
          message: result.error.message,
        });
      }

      if (errorCode === "USER_NOT_FOUND" || errorCode === "POST_NOT_FOUND") {
        return res.status(404).json({
          isError: true,
          code: errorCode,
          message: result.error.message,
        });
      }

      return res.status(500).json({
        isError: true,
        code: errorCode ?? "UNKNOWN_ERROR",
        message:
          result.error?.message ?? "게시물 상세 조회 중 오류가 발생했습니다.",
      });
    }

    // 성공 응답
    return res.status(200).json({
      isError: false,
      ...result.data,
    });
  } catch (error) {
    console.error("getPostDetail error:", error);
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const authorMongoId = req.user.mongoId; // authenticate 미들웨어가 붙여준 _id
    const { content, media, primaryCategory, categories, customCategories } =
      req.body;

    const result = await createPostData({
      authorMongoId,
      content,
      media,
      primaryCategory,
      categories,
      customCategories,
    });

    if (!result.success) {
      const errorCode = result.error?.code;

      if (
        errorCode === "INVALID_AUTHOR_ID" ||
        errorCode === "POST_CONTENT_TOO_LONG" ||
        errorCode === "INVALID_POST_MEDIA" ||
        errorCode === "POST_MEDIA_LIMIT_EXCEEDED" ||
        errorCode === "INVALID_POST_MEDIA_URL" ||
        errorCode === "INVALID_POST_MEDIA_TYPE" ||
        errorCode === "INVALID_POST_MEDIA_ORDER" ||
        errorCode === "INVALID_POST_PRIMARY_CATEGORY" ||
        errorCode === "INVALID_POST_CATEGORIES" ||
        errorCode === "POST_CATEGORIES_LIMIT_EXCEEDED" ||
        errorCode === "INVALID_POST_CATEGORY_VALUE" ||
        errorCode === "INVALID_POST_CUSTOM_CATEGORIES" ||
        errorCode === "POST_CUSTOM_CATEGORIES_LIMIT_EXCEEDED"
      ) {
        return res.status(400).json({
          isError: true,
          code: errorCode,
          message: result.error.message,
        });
      }

      if (errorCode === "AUTHOR_NOT_FOUND") {
        return res.status(404).json({
          isError: true,
          code: errorCode,
          message: result.error.message,
        });
      }

      return res.status(500).json({
        isError: true,
        code: errorCode ?? "UNKNOWN_ERROR",
        message: result.error?.message ?? "게시물 등록 중 오류가 발생했습니다.",
      });
    }

    return res.status(201).json({
      isError: false,
      ...result.data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPostDetail,
  createPost,
};
