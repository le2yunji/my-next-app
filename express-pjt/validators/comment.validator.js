const mongoose = require("mongoose");

const MAX_COMMENT_LENGTH = 500;

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const normalizeCommentContent = (content) => {
  return typeof content === "string" ? content.trim() : "";
};

const validateCommentContent = (content) => {
  const normalizedContent = normalizeCommentContent(content);

  if (!normalizedContent) {
    return {
      valid: false,
      error: {
        code: "INVALID_COMMENT_CONTENT",
        message: "댓글 내용을 입력해주세요.",
      },
    };
  }

  if (normalizedContent.length > MAX_COMMENT_LENGTH) {
    return {
      valid: false,
      error: {
        code: "COMMENT_TOO_LONG",
        message: `댓글은 최대 ${MAX_COMMENT_LENGTH}자까지 입력할 수 있습니다.`,
      },
    };
  }

  return {
    valid: true,
    normalizedContent,
  };
};

const validatePostId = (postId) => {
  if (!isValidObjectId(postId)) {
    return {
      valid: false,
      error: {
        code: "INVALID_POST_ID",
        message: "유효하지 않은 게시물 id입니다.",
      },
    };
  }

  return { valid: true };
};

const validateAuthorId = (authorId) => {
  if (!isValidObjectId(authorId)) {
    return {
      valid: false,
      error: {
        code: "INVALID_AUTHOR_ID",
        message: "유효하지 않은 사용자 id입니다.",
      },
    };
  }

  return { valid: true };
};

const validateParentCommentId = (parentCommentId) => {
  if (parentCommentId == null) {
    return { valid: true };
  }

  if (!isValidObjectId(parentCommentId)) {
    return {
      valid: false,
      error: {
        code: "INVALID_PARENT_COMMENT_ID",
        message: "유효하지 않은 부모 댓글 id입니다.",
      },
    };
  }

  return { valid: true };
};

const validateCommentId = (commentId) => {
  if (!isValidObjectId(commentId)) {
    return {
      valid: false,
      error: {
        code: "INVALID_COMMENT_ID",
        message: "유효하지 않은 댓글 id입니다.",
      },
    };
  }

  return { valid: true };
};

module.exports = {
  isValidObjectId,
  validatePostId,
  validateAuthorId,
  validateParentCommentId,
  validateCommentContent,
  validateCommentId,
};
