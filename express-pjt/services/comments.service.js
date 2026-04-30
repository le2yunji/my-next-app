const { findActivePostById } = require("../repositories/post.repository");
const {
  findActiveUserByMongoId,
  findActiveUsersSummaryByMongoIds,
} = require("../repositories/user.repository");
const {
  findCommentsByPostId,
  findActiveParentComment,
  createCommentDoc,
  increaseCommentReplyCount,
  findCommentById,
  deleteCommentById,
  deleteRepliesByParentId,
  decreaseCommentReplyCount,
  updateCommentContent,
} = require("../repositories/comment.repository");
const {
  validatePostId,
  validateAuthorId,
  validateParentCommentId,
  validateCommentContent,
  validateCommentId,
} = require("../validators/comment.validator");
const { buildCommentThreads } = require("../utils/comment-thread");
const { createNotificationIfAllowed } = require("./notification.service");

/**
 * 게시물의 댓글 목록 조회
 *
 * 역할:
 * 1. postId 형식 검증
 * 2. 게시물 존재 여부 확인
 * 3. 해당 게시물의 댓글 전체 조회
 * 4. 댓글 작성자 정보 조회
 * 5. 원댓글 / 대댓글 구조로 묶어서 반환
 *
 * 반환 형태:
 * {
 *   success: true,
 *   data: {
 *     items: [
 *       {
 *         comment: 원댓글,
 *         author: 작성자,
 *         replies: [{ comment: 대댓글, author: 작성자 }]
 *       }
 *     ],
 *     pageInfo
 *   }
 * }
 */
const getPostCommentsData = async ({ postId, cursor = null, limit = 10 }) => {
  // 1) postId가 MongoDB ObjectId 형식인지 먼저 검증
  const postIdValidation = validatePostId(postId);
  if (!postIdValidation.valid) {
    return {
      success: false,
      error: postIdValidation.error,
    };
  }

  // 2) 삭제되지 않은 게시물인지 확인
  const post = await findActivePostById(postId);

  if (!post) {
    return {
      success: false,
      error: {
        code: "POST_NOT_FOUND",
        message: "존재하지 않는 게시물입니다.",
      },
    };
  }

  // 3) 해당 게시물의 댓글 전체 조회
  // 이 단계에서는 원댓글 / 대댓글 구분 없이 전부 가져옴
  const allComments = await findCommentsByPostId(postId);

  // 4) 댓글 작성자 id만 중복 없이 추출
  const authorIds = [
    ...new Set(allComments.map((comment) => String(comment.authorId))),
  ];

  // 5) 댓글 작성자 정보 한 번에 조회
  const authors = await findActiveUsersSummaryByMongoIds(authorIds);

  // 6) 댓글 목록을 "원댓글 + 대댓글 묶음" 구조로 변환
  // cursor / limit 기준으로 원댓글만 페이지네이션함
  const { items, pageInfo } = buildCommentThreads({
    allComments,
    authors,
    cursor,
    limit,
  });

  // 7) 최종 결과 반환
  return {
    success: true,
    data: {
      items,
      pageInfo,
    },
  };
};

/**
 * 댓글 / 대댓글 생성
 *
 * 역할:
 * 1. postId, authorId, parentCommentId 형식 검증
 * 2. 댓글 내용 검증 (공백, 최대 길이)
 * 3. 게시물 / 작성자 존재 여부 확인
 * 4. 부모 댓글 검증
 *    - 같은 게시물의 댓글인지
 *    - 대댓글의 대댓글은 아닌지
 * 5. 댓글 생성
 * 6. 대댓글이면 부모 댓글 replyCount 증가
 *
 * 규칙:
 * - parentCommentId가 없으면 원댓글
 * - parentCommentId가 있으면 대댓글
 * - 1단계 대댓글까지만 허용
 */
const createPostCommentData = async ({
  postId,
  authorId,
  content,
  parentCommentId = null,
}) => {
  // 1) 게시물 id 형식 검증
  const postIdValidation = validatePostId(postId);
  if (!postIdValidation.valid) {
    return {
      success: false,
      error: postIdValidation.error,
    };
  }

  // 2) 작성자 id 형식 검증
  const authorIdValidation = validateAuthorId(authorId);
  if (!authorIdValidation.valid) {
    return {
      success: false,
      error: authorIdValidation.error,
    };
  }

  // 3) 부모 댓글 id 형식 검증
  // parentCommentId가 null이면 원댓글이므로 통과
  const parentCommentIdValidation = validateParentCommentId(parentCommentId);
  if (!parentCommentIdValidation.valid) {
    return {
      success: false,
      error: parentCommentIdValidation.error,
    };
  }

  // 4) 댓글 내용 검증
  const contentValidation = validateCommentContent(content);
  if (!contentValidation.valid) {
    return {
      success: false,
      error: contentValidation.error,
    };
  }

  // 5) 게시물 / 작성자 동시에 조회
  const [post, author] = await Promise.all([
    findActivePostById(postId),
    findActiveUserByMongoId(authorId),
  ]);

  // 게시물이 없으면 생성 불가
  if (!post) {
    return {
      success: false,
      error: {
        code: "POST_NOT_FOUND",
        message: "존재하지 않는 게시물입니다.",
      },
    };
  }

  // 작성자가 없으면 생성 불가
  if (!author) {
    return {
      success: false,
      error: {
        code: "AUTHOR_NOT_FOUND",
        message: "존재하지 않는 사용자입니다.",
      },
    };
  }

  // 기본값은 원댓글
  let depth = 0;
  let validatedParentCommentId = null;

  // 6) parentCommentId가 있으면 "대댓글 생성" 흐름으로 처리
  if (parentCommentId != null) {
    // 같은 게시물 안의, 삭제되지 않은 부모 댓글 조회
    const parentComment = await findActiveParentComment({
      parentCommentId,
      postId,
    });

    // 부모 댓글이 없으면 대댓글 생성 불가
    if (!parentComment) {
      return {
        success: false,
        error: {
          code: "PARENT_COMMENT_NOT_FOUND",
          message: "부모 댓글을 찾을 수 없습니다.",
        },
      };
    }

    // 부모 댓글이 이미 대댓글이면
    // -> 대댓글의 대댓글이 되므로 금지
    if (parentComment.parentCommentId != null) {
      return {
        success: false,
        error: {
          code: "REPLY_DEPTH_EXCEEDED",
          message: "대댓글에는 답글을 달 수 없습니다.",
        },
      };
    }

    // 정상적인 대댓글이면 depth = 1
    depth = 1;
    validatedParentCommentId = parentComment._id;
  }

  // 7) 댓글 생성
  const createdComment = await createCommentDoc({
    postId,
    authorId,
    content: contentValidation.normalizedContent,
    parentCommentId: validatedParentCommentId,
    depth,
    replyCount: 0,
  });

  // 8) 대댓글이면 부모 댓글의 replyCount 증가 + 부모 작성자에게 알림
  if (validatedParentCommentId) {
    await increaseCommentReplyCount(validatedParentCommentId, 1);

    createNotificationIfAllowed({
      type: "COMMENT_REPLY",
      senderId: authorId,
      recipientId: parentComment.authorId,
      targetId: createdComment._id,
      targetType: "COMMENT",
    }).catch((err) => console.error("COMMENT_REPLY notification error:", err));
  }

  // 10) 생성 결과 반환
  return {
    success: true,
    data: {
      comment: createdComment.toObject(),
      author,
    },
  };
};

/**
 * 댓글 / 대댓글 삭제
 *
 * 1. commentId 형식 검증
 * 2. 댓글 존재 여부 + 해당 게시물의 댓글인지 확인
 * 3. 요청자가 작성자인지 확인
 * 4. 댓글 삭제
 * 5. 대댓글이면 부모 댓글 replyCount 감소, 원댓글이면 대댓글 cascade 삭제
 */
const deletePostCommentData = async ({ postId, commentId, requesterId }) => {
  const postIdValidation = validatePostId(postId);
  if (!postIdValidation.valid) {
    return { success: false, error: postIdValidation.error };
  }

  const commentIdValidation = validateCommentId(commentId);
  if (!commentIdValidation.valid) {
    return { success: false, error: commentIdValidation.error };
  }

  const comment = await findCommentById(commentId);

  if (!comment) {
    return {
      success: false,
      error: { code: "COMMENT_NOT_FOUND", message: "댓글을 찾을 수 없습니다." },
    };
  }

  if (String(comment.postId) !== String(postId)) {
    return {
      success: false,
      error: {
        code: "COMMENT_POST_MISMATCH",
        message: "해당 게시물의 댓글이 아닙니다.",
      },
    };
  }

  if (String(comment.authorId) !== String(requesterId)) {
    return {
      success: false,
      error: { code: "FORBIDDEN", message: "본인 댓글만 삭제할 수 있습니다." },
    };
  }

  await deleteCommentById(commentId);

  if (comment.parentCommentId) {
    // 대댓글이면 부모의 replyCount 감소
    await decreaseCommentReplyCount(comment.parentCommentId, 1);
  } else {
    // 원댓글이면 대댓글도 cascade 삭제
    await deleteRepliesByParentId(commentId);
  }

  return { success: true };
};

/**
 * 댓글 내용 수정
 * 1. postId / commentId 형식 검증
 * 2. 댓글 존재 + 해당 게시물의 댓글인지 확인
 * 3. 요청자가 작성자인지 확인
 * 4. 내용 검증 후 업데이트
 */
const updatePostCommentData = async ({
  postId,
  commentId,
  requesterId,
  content,
}) => {
  const postIdValidation = validatePostId(postId);
  if (!postIdValidation.valid)
    return { success: false, error: postIdValidation.error };

  const commentIdValidation = validateCommentId(commentId);
  if (!commentIdValidation.valid)
    return { success: false, error: commentIdValidation.error };

  const contentValidation = validateCommentContent(content);
  if (!contentValidation.valid)
    return { success: false, error: contentValidation.error };

  const comment = await findCommentById(commentId);

  if (!comment) {
    return {
      success: false,
      error: { code: "COMMENT_NOT_FOUND", message: "댓글을 찾을 수 없습니다." },
    };
  }

  if (String(comment.postId) !== String(postId)) {
    return {
      success: false,
      error: {
        code: "COMMENT_POST_MISMATCH",
        message: "해당 게시물의 댓글이 아닙니다.",
      },
    };
  }

  if (String(comment.authorId) !== String(requesterId)) {
    return {
      success: false,
      error: { code: "FORBIDDEN", message: "본인 댓글만 수정할 수 있습니다." },
    };
  }

  const updated = await updateCommentContent(
    commentId,
    contentValidation.normalizedContent,
  );

  return { success: true, data: { comment: updated } };
};

module.exports = {
  getPostCommentsData,
  createPostCommentData,
  deletePostCommentData,
  updatePostCommentData,
};
