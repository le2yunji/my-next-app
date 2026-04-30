const mongoose = require("mongoose");

// post.model.js와 동일한 카테고리 목록
const SYSTEM_CATEGORIES = [
  "fashion",
  "beauty",
  "cafe",
  "food",
  "travel",
  "interior",
  "object",
  "desk",
  "art",
  "music",
  "book",
  "film",
  "photo",
  "plant",
  "pet",
];

const MAX_CONTENT_LENGTH = 2000;
const MAX_MEDIA_COUNT = 10;
const MAX_CATEGORIES_COUNT = 3;
const MAX_CUSTOM_CATEGORIES_COUNT = 3;

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateAuthorMongoId = (authorMongoId) => {
  if (!isValidObjectId(authorMongoId)) {
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

const validatePostContent = (content) => {
  // content는 선택 필드 — 없으면 빈 문자열로 처리
  const normalized = typeof content === "string" ? content.trim() : "";

  if (normalized.length > MAX_CONTENT_LENGTH) {
    return {
      valid: false,
      error: {
        code: "POST_CONTENT_TOO_LONG",
        message: `게시물 내용은 최대 ${MAX_CONTENT_LENGTH}자까지 입력할 수 있습니다.`,
      },
    };
  }

  return { valid: true, normalizedContent: normalized };
};

const validatePostMedia = (media) => {
  // media는 선택 필드 — 없으면 빈 배열로 처리
  if (media == null) return { valid: true, normalizedMedia: [] };

  if (!Array.isArray(media)) {
    return {
      valid: false,
      error: {
        code: "INVALID_POST_MEDIA",
        message: "미디어는 배열 형태로 전달해야 합니다.",
      },
    };
  }

  if (media.length > MAX_MEDIA_COUNT) {
    return {
      valid: false,
      error: {
        code: "POST_MEDIA_LIMIT_EXCEEDED",
        message: `미디어는 최대 ${MAX_MEDIA_COUNT}개까지 업로드할 수 있습니다.`,
      },
    };
  }

  for (const item of media) {
    if (!item.url || typeof item.url !== "string") {
      return {
        valid: false,
        error: {
          code: "INVALID_POST_MEDIA_URL",
          message: "미디어 항목에 유효한 url이 필요합니다.",
        },
      };
    }

    if (item.type && !["image", "video"].includes(item.type)) {
      return {
        valid: false,
        error: {
          code: "INVALID_POST_MEDIA_TYPE",
          message: "미디어 타입은 image 또는 video여야 합니다.",
        },
      };
    }

    if (item.order == null || typeof item.order !== "number" || item.order < 1) {
      return {
        valid: false,
        error: {
          code: "INVALID_POST_MEDIA_ORDER",
          message: "미디어 항목에 1 이상의 숫자 order가 필요합니다.",
        },
      };
    }
  }

  return { valid: true, normalizedMedia: media };
};

const validatePostCategories = (categories) => {
  if (categories == null) return { valid: true, normalizedCategories: [] };

  if (!Array.isArray(categories)) {
    return {
      valid: false,
      error: {
        code: "INVALID_POST_CATEGORIES",
        message: "카테고리는 배열 형태로 전달해야 합니다.",
      },
    };
  }

  if (categories.length > MAX_CATEGORIES_COUNT) {
    return {
      valid: false,
      error: {
        code: "POST_CATEGORIES_LIMIT_EXCEEDED",
        message: `카테고리는 최대 ${MAX_CATEGORIES_COUNT}개까지 선택할 수 있습니다.`,
      },
    };
  }

  const invalid = categories.find((c) => !SYSTEM_CATEGORIES.includes(c));
  if (invalid) {
    return {
      valid: false,
      error: {
        code: "INVALID_POST_CATEGORY_VALUE",
        message: `유효하지 않은 카테고리입니다: ${invalid}`,
      },
    };
  }

  return { valid: true, normalizedCategories: categories };
};

const validatePostPrimaryCategory = (primaryCategory) => {
  if (primaryCategory == null) return { valid: true };

  if (!SYSTEM_CATEGORIES.includes(primaryCategory)) {
    return {
      valid: false,
      error: {
        code: "INVALID_POST_PRIMARY_CATEGORY",
        message: `유효하지 않은 대표 카테고리입니다: ${primaryCategory}`,
      },
    };
  }

  return { valid: true };
};

const validatePostCustomCategories = (customCategories) => {
  if (customCategories == null) return { valid: true, normalizedCustomCategories: [] };

  if (!Array.isArray(customCategories)) {
    return {
      valid: false,
      error: {
        code: "INVALID_POST_CUSTOM_CATEGORIES",
        message: "직접 입력 카테고리는 배열 형태로 전달해야 합니다.",
      },
    };
  }

  if (customCategories.length > MAX_CUSTOM_CATEGORIES_COUNT) {
    return {
      valid: false,
      error: {
        code: "POST_CUSTOM_CATEGORIES_LIMIT_EXCEEDED",
        message: `직접 입력 카테고리는 최대 ${MAX_CUSTOM_CATEGORIES_COUNT}개까지 입력할 수 있습니다.`,
      },
    };
  }

  return { valid: true, normalizedCustomCategories: customCategories };
};

module.exports = {
  validateAuthorMongoId,
  validatePostContent,
  validatePostMedia,
  validatePostCategories,
  validatePostPrimaryCategory,
  validatePostCustomCategories,
};
