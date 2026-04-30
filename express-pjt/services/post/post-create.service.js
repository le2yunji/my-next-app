const { createPost } = require("../../repositories/post.repository");
const {
  findActiveUserByMongoId,
  increaseUserPostCount,
} = require("../../repositories/user.repository");
const {
  validateAuthorMongoId,
  validatePostContent,
  validatePostMedia,
  validatePostCategories,
  validatePostPrimaryCategory,
  validatePostCustomCategories,
} = require("../../validators/post.validator");

/**
 * 게시물 등록
 *
 * 역할:
 * 1. authorMongoId 형식 검증
 * 2. 작성자 존재 여부 확인
 * 3. content / media / categories 유효성 검증
 * 4. 게시물 생성
 * 5. 작성자 postCount +1
 *
 * 반환 형태:
 * {
 *   success: true,
 *   data: { post }
 * }
 */
const createPostData = async ({
  authorMongoId,
  content,
  media,
  primaryCategory,
  categories,
  customCategories,
}) => {
  // 1) 작성자 id 형식 검증
  const authorIdValidation = validateAuthorMongoId(authorMongoId);
  if (!authorIdValidation.valid) {
    return { success: false, error: authorIdValidation.error };
  }

  // 2) 작성자 존재 여부 확인
  const author = await findActiveUserByMongoId(authorMongoId);
  if (!author) {
    return {
      success: false,
      error: {
        code: "AUTHOR_NOT_FOUND",
        message: "존재하지 않는 사용자입니다.",
      },
    };
  }

  // 3) 입력값 유효성 검증
  const contentValidation = validatePostContent(content);
  if (!contentValidation.valid) {
    return { success: false, error: contentValidation.error };
  }

  const mediaValidation = validatePostMedia(media);
  if (!mediaValidation.valid) {
    return { success: false, error: mediaValidation.error };
  }

  const primaryCategoryValidation =
    validatePostPrimaryCategory(primaryCategory);
  if (!primaryCategoryValidation.valid) {
    return { success: false, error: primaryCategoryValidation.error };
  }

  const categoriesValidation = validatePostCategories(categories);
  if (!categoriesValidation.valid) {
    return { success: false, error: categoriesValidation.error };
  }

  const customCategoriesValidation =
    validatePostCustomCategories(customCategories);
  if (!customCategoriesValidation.valid) {
    return { success: false, error: customCategoriesValidation.error };
  }

  // 4) 게시물 생성
  const post = await createPost({
    authorId: authorMongoId,
    content: contentValidation.normalizedContent,
    media: mediaValidation.normalizedMedia,
    primaryCategory: primaryCategory ?? undefined,
    categories: categoriesValidation.normalizedCategories,
    customCategories: customCategoriesValidation.normalizedCustomCategories,
  });

  // 5) 작성자 게시물 수 증가
  await increaseUserPostCount(authorMongoId, 1);

  return {
    success: true,
    data: {
      post: post.toObject(),
    },
  };
};

module.exports = { createPostData };
