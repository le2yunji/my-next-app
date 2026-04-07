// 댓글 기본 페이지 크기
const DEFAULT_LIMIT = 10;

// 한 번에 너무 많이 가져오지 않도록 최대 제한
const MAX_LIMIT = 50;

// limit 값을 안전한 숫자로 보정
const normalizeLimit = (limit) => {
  const parsed = Number(limit);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(parsed, MAX_LIMIT);
};

// 댓글 배열을 생성 시간 오름차순으로 정렬
const sortCommentsByCreatedAtAsc = (items = []) => {
  return [...items].sort((a, b) => {
    const timeDiff =
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

    if (timeDiff !== 0) {
      return timeDiff;
    }

    return String(a._id).localeCompare(String(b._id));
  });
};

// 원댓글 목록만 커서 기반으로 페이지네이션
const paginateRootComments = ({
  items,
  cursor = null,
  limit = DEFAULT_LIMIT,
}) => {
  // limit 값 보정
  const normalizedLimit = normalizeLimit(limit);

  // 기본 시작 위치는 맨 앞
  let startIndex = 0;

  // cursor가 있으면 해당 댓글 다음부터 잘라오기
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

  // 다음 페이지가 더 있는지 여부
  const hasNext = startIndex + normalizedLimit < items.length;

  // 다음 페이지 요청에 사용할 cursor
  // 현재 페이지 마지막 원댓글의 _id를 사용
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

/**
 * 댓글 전체 목록을 "원댓글 + 대댓글" 트리 구조로 변환
 *
 * 역할:
 * 1. 전체 댓글에서 원댓글만 추출
 * 2. 원댓글만 페이지네이션
 * 3. 현재 페이지 원댓글에 달린 대댓글만 모음
 * 4. 작성자 정보와 함께 최종 트리 구조로 조립
 *
 * 반환:
 * {
 *   items: [
 *     {
 *       comment: 원댓글,
 *       author: 원댓글 작성자,
 *       replies: [
 *         {
 *           comment: 대댓글,
 *           author: 대댓글 작성자
 *         }
 *       ]
 *     }
 *   ],
 *   pageInfo
 * }
 */
const buildCommentThreads = ({ allComments, authors, cursor, limit }) => {
  // 1) 원댓글만 추출
  // parentCommentId가 null이면 부모가 없는 댓글 = 원댓글
  const rootComments = allComments.filter(
    (comment) => comment.parentCommentId == null
  );

  // 2) 원댓글만 페이지네이션
  const { pagedItems, pageInfo } = paginateRootComments({
    items: rootComments,
    cursor,
    limit,
  });

  // 3) 현재 페이지에 포함된 원댓글 id 집합
  // 대댓글을 "현재 페이지 원댓글 기준"으로만 묶기 위해 사용
  const pagedRootIds = new Set(
    pagedItems.map((comment) => String(comment._id))
  );

  // 4) 작성자 빠른 조회용 Map
  // key   : author._id
  // value : author 객체
  const authorMap = new Map(
    authors.map((author) => [String(author._id), author])
  );

  // 5) 대댓글 묶음용 Map
  // key   : 부모 댓글 id
  // value : 해당 부모 댓글에 달린 대댓글 배열
  const replyMap = new Map();

  for (const comment of allComments) {
    // 원댓글이면 스킵
    if (!comment.parentCommentId) continue;

    const parentId = String(comment.parentCommentId);

    // 현재 페이지에 없는 원댓글의 대댓글은 이번 응답에 포함하지 않음
    if (!pagedRootIds.has(parentId)) continue;

    const currentReplies = replyMap.get(parentId) ?? [];
    currentReplies.push(comment);
    replyMap.set(parentId, currentReplies);
  }

  // 6) 최종 댓글 스레드 구조 조립
  const items = pagedItems.map((rootComment) => ({
    comment: rootComment,
    author: authorMap.get(String(rootComment.authorId)) ?? null,
    replies: sortCommentsByCreatedAtAsc(
      replyMap.get(String(rootComment._id)) ?? []
    ).map((reply) => ({
      comment: reply,
      author: authorMap.get(String(reply.authorId)) ?? null,
    })),
  }));

  return {
    items,
    pageInfo,
  };
};

module.exports = {
  normalizeLimit,
  sortCommentsByCreatedAtAsc,
  paginateRootComments,
  buildCommentThreads,
};
