// services/comments.service.js
const mongoose = require("mongoose");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");

// 기본 페이지 크기
const DEFAULT_LIMIT = 10;

// 한 번에 너무 많이 가져오지 않도록 최대 제한
const MAX_LIMIT = 50;

// 댓글 최대 길이
const MAX_COMMENT_LENGTH = 500;

// MongoDB ObjectId 형식이 맞는지 검사
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

// limit 값을 숫자로 보정
// - 숫자가 아니거나 1 미만이면 기본값 사용
// - 너무 크면 MAX_LIMIT까지만 허용
const normalizeLimit = (limit) => {
  const parsed = Number(limit);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
};

// 댓글을 생성 시간 오름차순으로 정렬
// createdAt이 같으면 _id 문자열 순으로 한 번 더 정렬해서 순서 안정화
const sortCommentsByCreatedAtAsc = (items = []) => {
  return [...items].sort((a, b) => {
    const timeDiff =
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    if (timeDiff !== 0) return timeDiff;

    return String(a._id).localeCompare(String(b._id));
  });
};

// "원댓글"만 커서 기반으로 페이지네이션
// 주의:
// 전체 댓글을 자르면 원댓글/대댓글이 서로 다른 페이지로 찢어질 수 있어서
// 이 함수는 원댓글 목록만 자르는 용도
const paginateRootComments = ({
  items,
  cursor = null,
  limit = DEFAULT_LIMIT,
}) => {
  const normalizedLimit = normalizeLimit(limit);

  // 기본 시작 위치는 0
  let startIndex = 0;

  // cursor가 있으면 그 댓글 다음부터 시작
  if (cursor) {
    const cursorIndex = items.findIndex(
      (item) => String(item._id) === String(cursor)
    );

    if (cursorIndex >= 0) {
      startIndex = cursorIndex + 1;
    }
  }

  // 현재 페이지 원댓글 잘라내기
  const pagedItems = items.slice(startIndex, startIndex + normalizedLimit);

  // 다음 페이지 존재 여부
  const hasNext = startIndex + normalizedLimit < items.length;

  // 다음 요청에 넘길 커서
  // 현재 페이지 마지막 원댓글의 _id를 cursor로 사용
  const nextCursor =
    hasNext && pagedItems.length > 0
      ? String(pagedItems[pagedItems.length - 1]._id)
      : null;

  return {
    pagedItems,
    pageInfo: {
      hasNext,
      nextCursor,
      limit: normalizedLimit,
    },
  };
};

// 작성자 정보가 삭제되었거나 조회 실패했을 때 사용할 fallback 값
const toFallbackAuthor = () => ({
  _id: null,
  userId: "",
  name: "알 수 없음",
  profileImage: null,
});

// User 문서를 댓글 응답용 작성자 형태로 축약
const toAuthorSummary = (author) => {
  if (!author) return toFallbackAuthor();
  return {
    _id: author._id,
    userId: author.userId,
    name: author.name,
    profileImage: author.profileImage ?? null,
  };
};

// Comment 문서를 API 응답용 형태로 변환
// 삭제된 댓글이면 실제 content 대신 "삭제된 댓글입니다."로 치환
const toCommentResponse = (comment) => ({
  _id: comment._id,
  postId: comment.postId,
  authorId: comment.authorId,
  content: comment.isDeleted ? "삭제된 댓글입니다." : comment.content,
  parentCommentId: comment.parentCommentId,
  depth: comment.depth,
  replyCount: comment.replyCount,
  isDeleted: comment.isDeleted,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
});

// 댓글 입력값 정리
// 문자열이 아니면 빈 문자열 처리
// 문자열이면 앞뒤 공백 제거
const normalizeCommentContent = (content) => {
  return typeof content === "string" ? content.trim() : "";
};

// 게시물 댓글 목록 조회
// 설계 포인트:
// 1) 먼저 게시물이 존재하는지 확인
// 2) 해당 게시물의 댓글 전체를 시간순으로 가져옴
// 3) 그중 parentCommentId가 null인 "원댓글"만 페이지네이션
// 4) 현재 페이지에 포함된 원댓글의 대댓글만 묶어서 함께 반환
const getPostCommentsData = async ({
  postId,
  cursor = null,
  limit = DEFAULT_LIMIT,
}) => {
  // 잘못된 postId 형식이면 바로 에러 반환
  if (!isValidObjectId(postId)) {
    return {
      success: false,
      error: {
        code: "INVALID_POST_ID",
        message: "유효하지 않은 게시물 id입니다.",
      },
    };
  }

  // 삭제되지 않은 게시물인지 확인
  const post = await Post.findOne({
    _id: postId,
    isDeleted: false,
  }).lean();

  if (!post) {
    return {
      success: false,
      error: {
        code: "POST_NOT_FOUND",
        message: "존재하지 않는 게시물입니다.",
      },
    };
  }

  // 해당 게시물의 댓글 전체 조회
  // createdAt, _id 오름차순으로 정렬해서 트리 순서가 최대한 안정적이게 함
  const allComments = await Comment.find({
    postId,
  })
    .sort({ createdAt: 1, _id: 1 })
    .lean();

  // 원댓글만 추출
  const rootComments = allComments.filter(
    (comment) => comment.parentCommentId == null
  );

  // 원댓글만 페이지네이션
  const { pagedItems, pageInfo } = paginateRootComments({
    items: rootComments,
    cursor,
    limit,
  });

  // 현재 페이지에 포함된 원댓글 id 집합
  const pagedRootIds = new Set(
    pagedItems.map((comment) => String(comment._id))
  );

  // 대댓글들을 parentCommentId 기준으로 묶기 위한 Map
  // key   : 부모 댓글 id
  // value : 해당 부모 댓글에 달린 대댓글 배열
  const replyMap = new Map();

  for (const comment of allComments) {
    // 원댓글이면 스킵
    if (!comment.parentCommentId) continue;

    const parentId = String(comment.parentCommentId);

    // 현재 페이지 원댓글의 대댓글만 묶음
    if (!pagedRootIds.has(parentId)) continue;

    const currentReplies = replyMap.get(parentId) ?? [];
    currentReplies.push(comment);
    replyMap.set(parentId, currentReplies);
  }

  // 현재 페이지에서 필요한 작성자 id만 모음
  const authorIds = new Set();

  for (const rootComment of pagedItems) {
    authorIds.add(String(rootComment.authorId));

    const replies = replyMap.get(String(rootComment._id)) ?? [];
    for (const reply of replies) {
      authorIds.add(String(reply.authorId));
    }
  }

  // 댓글/대댓글 작성자 정보를 한 번에 조회
  const authors = await User.find({
    _id: { $in: [...authorIds] },
    isDeleted: false,
  })
    .select("_id userId name profileImage")
    .lean();

  // 빠르게 찾기 위해 Map으로 변환
  const authorMap = new Map(
    authors.map((author) => [String(author._id), author])
  );

  // 최종 응답 조립
  // 구조:
  // [
  //   {
  //     comment: 원댓글,
  //     author: 원댓글 작성자,
  //     replies: [
  //       { comment: 대댓글, author: 대댓글 작성자 },
  //       ...
  //     ]
  //   }
  // ]
  const items = pagedItems.map((rootComment) => {
    const replies = sortCommentsByCreatedAtAsc(
      replyMap.get(String(rootComment._id)) ?? []
    );

    return {
      comment: toCommentResponse(rootComment),
      author: toAuthorSummary(authorMap.get(String(rootComment.authorId))),
      replies: replies.map((reply) => ({
        comment: toCommentResponse(reply),
        author: toAuthorSummary(authorMap.get(String(reply.authorId))),
      })),
    };
  });

  return {
    success: true,
    data: {
      items,
      pageInfo,
    },
  };
};

// 댓글 / 대댓글 생성
// 설계 포인트:
// - 게시물 존재 여부 확인
// - 작성자 존재 여부 확인
// - 댓글 내용 검증
// - parentCommentId가 있으면 "대댓글"로 판단
// - 부모 댓글이 또 다른 대댓글이면 막아서 1단계 대댓글만 허용
const createPostCommentData = async ({
  postId,
  authorId,
  content,
  parentCommentId = null,
}) => {
  // postId 형식 검사
  if (!isValidObjectId(postId)) {
    return {
      success: false,
      error: {
        code: "INVALID_POST_ID",
        message: "유효하지 않은 게시물 id입니다.",
      },
    };
  }

  // authorId 형식 검사
  if (!isValidObjectId(authorId)) {
    return {
      success: false,
      error: {
        code: "INVALID_AUTHOR_ID",
        message: "유효하지 않은 사용자 id입니다.",
      },
    };
  }

  // 입력 댓글 내용 정리
  const normalizedContent = normalizeCommentContent(content);

  // 공백만 있는 댓글 방지
  if (!normalizedContent) {
    return {
      success: false,
      error: {
        code: "INVALID_COMMENT_CONTENT",
        message: "댓글 내용을 입력해주세요.",
      },
    };
  }

  // 최대 길이 초과 방지
  if (normalizedContent.length > MAX_COMMENT_LENGTH) {
    return {
      success: false,
      error: {
        code: "COMMENT_TOO_LONG",
        message: `댓글은 최대 ${MAX_COMMENT_LENGTH}자까지 입력할 수 있습니다.`,
      },
    };
  }

  // 게시물 / 작성자 동시에 조회
  const [post, author] = await Promise.all([
    Post.findOne({ _id: postId, isDeleted: false }).lean(),
    User.findOne({ _id: authorId, isDeleted: false })
      .select("_id userId name profileImage")
      .lean(),
  ]);

  // 게시물 없으면 중단
  if (!post) {
    return {
      success: false,
      error: {
        code: "POST_NOT_FOUND",
        message: "존재하지 않는 게시물입니다.",
      },
    };
  }

  // 작성자 없으면 중단
  if (!author) {
    return {
      success: false,
      error: {
        code: "AUTHOR_NOT_FOUND",
        message: "존재하지 않는 사용자입니다.",
      },
    };
  }

  // 기본은 원댓글
  let depth = 0;
  let validatedParentCommentId = null;

  // parentCommentId가 있으면 대댓글 생성 흐름
  if (parentCommentId != null) {
    // 부모 댓글 id 형식 검사
    if (!isValidObjectId(parentCommentId)) {
      return {
        success: false,
        error: {
          code: "INVALID_PARENT_COMMENT_ID",
          message: "유효하지 않은 부모 댓글 id입니다.",
        },
      };
    }

    // 같은 게시물 안의 삭제되지 않은 부모 댓글만 허용
    const parentComment = await Comment.findOne({
      _id: parentCommentId,
      postId,
      isDeleted: false,
    }).lean();

    if (!parentComment) {
      return {
        success: false,
        error: {
          code: "PARENT_COMMENT_NOT_FOUND",
          message: "부모 댓글을 찾을 수 없습니다.",
        },
      };
    }

    // 1단계 대댓글만 허용
    // 부모 댓글이 이미 대댓글이면, 그 아래 답글은 금지
    if (parentComment.parentCommentId != null) {
      return {
        success: false,
        error: {
          code: "REPLY_DEPTH_EXCEEDED",
          message: "대댓글에는 답글을 달 수 없습니다.",
        },
      };
    }

    // 정상적인 대댓글이면 depth=1
    depth = 1;
    validatedParentCommentId = parentComment._id;
  }

  // 댓글 생성
  const createdComment = await Comment.create({
    postId,
    authorId,
    content: normalizedContent,
    parentCommentId: validatedParentCommentId,
    depth,
    replyCount: 0,
    isDeleted: false,
  });

  // 게시물 전체 댓글 수 증가
  await Post.updateOne({ _id: postId }, { $inc: { commentCount: 1 } });

  // 대댓글이면 부모 댓글의 답글 수 증가
  if (validatedParentCommentId) {
    await Comment.updateOne(
      { _id: validatedParentCommentId },
      { $inc: { replyCount: 1 } }
    );
  }

  // 생성 결과 반환
  return {
    success: true,
    data: {
      comment: toCommentResponse(createdComment.toObject()),
      author: toAuthorSummary(author),
    },
  };
};

module.exports = {
  getPostCommentsData,
  createPostCommentData,
};
