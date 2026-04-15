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

// 유저가 가진 보드 리스트
async function getUserBoardsData({ userId, viewerId = null }) {
  try {
    const user = await findUserByUserId(userId);
    if (!user) {
      return {
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "존재하지 않는 사용자입니다.",
        },
      };
    }

    const isOwner = viewerId ? isSameId(user._id, viewerId) : false;

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

    const boardIds = boards.map((board) => board._id);
    const boardItems = await findBoardPreviewItemsByBoardIds({ boardIds });
    const previewMap = buildBoardPreviewImageMap(boardItems, 3);

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
  } catch (err) {
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: err.message },
    };
  }
}

// 유저가 가진 보드 각각의 아이템
async function getUserBoardPageData({
  userId,
  boardId,
  viewerId = null,
  cursor = null,
  limit = DEFAULT_LIMIT,
}) {
  try {
    if (!isValidObjectId(boardId)) {
      return {
        success: false,
        error: {
          code: "INVALID_BOARD_ID",
          message: "유효하지 않은 보드 id입니다.",
        },
      };
    }
    if (cursor && !isValidObjectId(cursor)) {
      return {
        success: false,
        error: { code: "INVALID_CURSOR", message: "유효하지 않은 커서입니다." },
      };
    }

    const normalizedLimit = normalizeLimit(limit);

    const user = await findUserByUserId(userId);
    if (!user) {
      return {
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "존재하지 않는 사용자입니다.",
        },
      };
    }

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

    const isOwner = viewerId ? isSameId(board.ownerId, viewerId) : false;
    const canView = board.visibility === "public" || isOwner;
    if (!canView) {
      return {
        success: false,
        error: {
          code: "BOARD_FORBIDDEN",
          message: "이 보드는 볼 수 없습니다.",
        },
      };
    }

    const rawItems = await findBoardItemsPageByBoardId({
      boardId: board._id,
      cursorObjectId: cursor ? toObjectId(cursor) : null,
      limit: normalizedLimit,
    });

    const paged = toCursorPage(rawItems, normalizedLimit);

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
  } catch (err) {
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: err.message },
    };
  }
}

module.exports = {
  getUserBoardsData,
  getUserBoardPageData,
};
