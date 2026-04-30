const {
  getPostCommentsData,
  createPostCommentData,
  deletePostCommentData,
  updatePostCommentData,
} = require("../services/comments.service");
const { toggleCommentLike } = require("../services/comment-like.service");
const {
  findLikedCommentIdSet,
} = require("../repositories/comment-like.repository");
const {
  toCommentThreadResponse,
  toCommentResponse,
} = require("../mappers/comment.mapper");

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
    const viewerId = req.user?.mongoId ?? null;

    // 로그인 사용자라면 현재 페이지 댓글들의 isLiked를 배치 조회
    let likedCommentIdSet = new Set();
    if (viewerId && items.length > 0) {
      const allCommentIds = items.flatMap(({ comment, replies }) => [
        String(comment._id),
        ...replies.map((r) => String(r.comment._id)),
      ]);
      likedCommentIdSet = await findLikedCommentIdSet({
        userId: viewerId,
        commentIds: allCommentIds,
      });
    }

    return res.status(200).json({
      isError: false,
      items: items.map((thread) =>
        toCommentThreadResponse(thread, likedCommentIdSet),
      ),
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

async function createPostComments(req, res) {
  try {
    const { postId } = req.params;
    const { content, parentCommentId = null } = req.body;
    const authorId = req.user.mongoId;

    const result = await createPostCommentData({
      postId,
      authorId,
      content,
      parentCommentId,
    });

    if (!result.success) {
      const { code, message } = result.error ?? {};

      const status400Codes = new Set([
        "INVALID_POST_ID",
        "INVALID_AUTHOR_ID",
        "INVALID_PARENT_COMMENT_ID",
        "INVALID_COMMENT_CONTENT",
        "COMMENT_TOO_LONG",
        "REPLY_DEPTH_EXCEEDED",
      ]);
      const status404Codes = new Set([
        "POST_NOT_FOUND",
        "AUTHOR_NOT_FOUND",
        "PARENT_COMMENT_NOT_FOUND",
      ]);

      const status = status400Codes.has(code)
        ? 400
        : status404Codes.has(code)
          ? 404
          : 500;

      return res.status(status).json({
        isError: true,
        code: code ?? "COMMENT_UNKNOWN_ERROR",
        message: message ?? "댓글 생성 중 오류가 발생했습니다.",
      });
    }

    const { comment, author } = result.data;

    return res.status(201).json({
      isError: false,
      comment: toCommentResponse({ comment, author }),
    });
  } catch (error) {
    console.error("createComments error:", error);

    return res.status(500).json({
      isError: true,
      code: "INTERNAL_SERVER_ERROR",
      message: "서버 에러가 발생했습니다.",
    });
  }
}

async function deletePostComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    const requesterId = req.user.mongoId;

    const result = await deletePostCommentData({
      postId,
      commentId,
      requesterId,
    });

    if (!result.success) {
      const { code, message } = result.error ?? {};

      const statusMap = {
        INVALID_POST_ID: 400,
        INVALID_COMMENT_ID: 400,
        COMMENT_NOT_FOUND: 404,
        COMMENT_POST_MISMATCH: 404,
        FORBIDDEN: 403,
      };

      return res.status(statusMap[code] ?? 500).json({
        isError: true,
        code: code ?? "DELETE_COMMENT_UNKNOWN_ERROR",
        message: message ?? "댓글 삭제 중 오류가 발생했습니다.",
      });
    }

    return res.status(200).json({ isError: false });
  } catch (error) {
    console.error("deletePostComment error:", error);
    return res.status(500).json({
      isError: true,
      code: "INTERNAL_SERVER_ERROR",
      message: "서버 에러가 발생했습니다.",
    });
  }
}

async function updatePostComment(req, res) {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const requesterId = req.user.mongoId;

    const result = await updatePostCommentData({
      postId,
      commentId,
      requesterId,
      content,
    });

    if (!result.success) {
      const { code, message } = result.error ?? {};
      const statusMap = {
        INVALID_POST_ID: 400,
        INVALID_COMMENT_ID: 400,
        INVALID_COMMENT_CONTENT: 400,
        COMMENT_TOO_LONG: 400,
        COMMENT_NOT_FOUND: 404,
        COMMENT_POST_MISMATCH: 404,
        FORBIDDEN: 403,
      };
      return res.status(statusMap[code] ?? 500).json({
        isError: true,
        code: code ?? "UPDATE_COMMENT_UNKNOWN_ERROR",
        message: message ?? "댓글 수정 중 오류가 발생했습니다.",
      });
    }

    return res.status(200).json({
      isError: false,
      comment: toCommentResponse({
        comment: result.data.comment,
        author: null,
      }),
    });
  } catch (error) {
    console.error("updatePostComment error:", error);
    return res.status(500).json({
      isError: true,
      code: "INTERNAL_SERVER_ERROR",
      message: "서버 에러가 발생했습니다.",
    });
  }
}

async function toggleCommentLikeHandler(req, res) {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.mongoId;

    const result = await toggleCommentLike({ commentId, postId, userId });

    if (!result.success) {
      const { code, message } = result.error ?? {};
      const statusMap = {
        INVALID_COMMENT_ID: 400,
        INVALID_USER_ID: 400,
        COMMENT_NOT_FOUND: 404,
        COMMENT_POST_MISMATCH: 404,
      };
      return res
        .status(statusMap[code] ?? 500)
        .json({ isError: true, code, message });
    }

    return res.status(200).json({ isError: false, ...result.data });
  } catch (error) {
    console.error("toggleCommentLike error:", error);
    return res.status(500).json({
      isError: true,
      code: "INTERNAL_SERVER_ERROR",
      message: "서버 에러가 발생했습니다.",
    });
  }
}

module.exports = {
  getPostComments,
  createPostComments,
  deletePostComment,
  updatePostComment,
  toggleCommentLikeHandler,
};
