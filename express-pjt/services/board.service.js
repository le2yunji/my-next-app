const { findUserByUserId } = require("../repositories/user.repository");
const {
  findAllBoardsByOwnerId,
  findBoardByIdAndOwnerId,
} = require("../repositories/board.repository");
const {
  findBoardPreviewItemsByBoardIds,
  findBoardItemsPageByBoardId,
} = require("../repositories/board-item.repository");
const { toUserResponse } = require("../mappers/user.mapper");
const {
  toBoardListItem,
  toBoardDetailResponse,
  toBoardItemResponse,
  buildBoardPreviewImageMap,
} = require("../mappers/board.mapper");
const { isValidObjectId, toObjectId, isSameId } = require("../utils/object-id");
const {
  DEFAULT_LIMIT,
  normalizeLimit,
  toCursorPage,
} = require("../utils/pagination");

// ─── 권한 확인 ────────────────────────────────────────────────────────────────

/** 보드를 열람할 수 있는지 확인 (public이거나 본인 소유) */
function canViewBoard(board, viewerId) {
  if (board.visibility === "public") return true;
  if (!viewerId) return false;
  return isSameId(board.ownerId, viewerId);
}

// ─── 입력 유효성 검사 ─────────────────────────────────────────────────────────

/** boardId·cursor가 유효한 ObjectId인지 검사, 오류 시 에러 객체 반환 */
function validateBoardPageInput(boardId, cursor) {
  if (!isValidObjectId(boardId)) {
    return {
      code: "INVALID_BOARD_ID",
      message: "유효하지 않은 보드 id입니다.",
    };
  }
  if (cursor && !isValidObjectId(cursor)) {
    return { code: "INVALID_CURSOR", message: "유효하지 않은 커서입니다." };
  }
  return null;
}

// ─── 서비스 로직 ──────────────────────────────────────────────────────────────

/**
 * 특정 유저의 보드 목록과 각 보드 미리보기 이미지를 반환
 * - 본인이면 비공개 보드도 포함, 타인이면 공개 보드만 포함
 */
async function getUserBoardsData({ userId, viewerId = null }) {
  // 1. 유저 조회
  const user = await findUserByUserId(userId);
  if (!user) {
    return {
      success: false,
      error: { code: "USER_NOT_FOUND", message: "존재하지 않는 사용자입니다." },
    };
  }

  const isOwner = viewerId ? isSameId(user._id, viewerId) : false;

  // 2. 보드 목록 조회 (본인이면 전체, 타인이면 공개만)
  const boards = await findAllBoardsByOwnerId({
    ownerId: user._id,
    visibility: isOwner ? null : "public",
  });

  if (boards.length === 0) {
    return {
      success: true,
      data: { user: toUserResponse(user), boards: [] },
    };
  }

  // 3. 보드별 미리보기 이미지 조회 및 맵 구성
  const boardIds = boards.map((board) => board._id);
  const boardItems = await findBoardPreviewItemsByBoardIds({ boardIds });
  const previewMap = buildBoardPreviewImageMap(boardItems, 3);

  // 4. 응답 조립
  return {
    success: true,
    data: {
      user: toUserResponse(user),
      boards: boards.map((board) =>
        toBoardListItem(
          board,
          previewMap.get(String(board._id)) ?? [],
          isOwner,
        ),
      ),
    },
  };
}

/**
 * 특정 보드의 아이템 목록을 커서 기반 페이지네이션으로 반환
 * - 입력 검증 → 유저·보드 조회 → 접근 권한 확인 → 아이템 페이징
 */
async function getUserBoardPageData({
  userId,
  boardId,
  viewerId = null,
  cursor = null,
  limit = DEFAULT_LIMIT,
}) {
  // 1. 입력값 유효성 검사
  const inputError = validateBoardPageInput(boardId, cursor);
  if (inputError) {
    return { success: false, error: inputError };
  }

  const normalizedLimit = normalizeLimit(limit);

  // 2. 유저 조회
  const user = await findUserByUserId(userId);
  if (!user) {
    return {
      success: false,
      error: { code: "USER_NOT_FOUND", message: "존재하지 않는 사용자입니다." },
    };
  }

  // 3. 보드 조회
  const board = await findBoardByIdAndOwnerId({ boardId, ownerId: user._id });
  if (!board) {
    return {
      success: false,
      error: {
        code: "BOARD_NOT_FOUND",
        message: "해당 사용자의 보드를 찾을 수 없습니다.",
      },
    };
  }

  // 4. 접근 권한 확인
  if (!canViewBoard(board, viewerId)) {
    return {
      success: false,
      error: { code: "BOARD_FORBIDDEN", message: "이 보드는 볼 수 없습니다." },
    };
  }

  const isOwner = viewerId ? isSameId(board.ownerId, viewerId) : false;

  // 5. 보드 아이템 커서 페이징 조회
  const rawItems = await findBoardItemsPageByBoardId({
    boardId: board._id,
    cursorObjectId: cursor ? toObjectId(cursor) : null,
    limit: normalizedLimit,
  });

  const paged = toCursorPage(rawItems, normalizedLimit);

  // 6. 응답 조립
  return {
    success: true,
    data: {
      user: toUserResponse(user),
      board: toBoardDetailResponse(board, isOwner),
      items: paged.items.map(toBoardItemResponse),
      nextCursor: paged.nextCursor,
      hasNext: paged.hasNext,
    },
  };
}

module.exports = {
  getUserBoardsData,
  getUserBoardPageData,
};
