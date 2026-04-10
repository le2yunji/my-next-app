const {
  getUserBoardsData,
  getUserBoardPageData,
} = require("../services/board.service");

function getStatusByErrorCode(code) {
  switch (code) {
    case "INVALID_BOARD_ID":
    case "INVALID_CURSOR":
      return 400;

    case "USER_NOT_FOUND":
    case "BOARD_NOT_FOUND":
      return 404;

    case "BOARD_FORBIDDEN":
      return 403;

    default:
      return 500;
  }
}

async function getUserBoards(req, res) {
  try {
    const { userId } = req.params;
    const viewerId = req.user?.mongoId || null;

    const result = await getUserBoardsData({
      userId,
      viewerId,
    });

    if (!result.success) {
      return res.status(getStatusByErrorCode(result.error.code)).json({
        message: result.error.message,
        code: result.error.code,
      });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error("[getUserBoards] unexpected error:", error);

    return res.status(500).json({
      message: "보드 목록을 불러오지 못했습니다.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

async function getUserBoardPage(req, res) {
  try {
    const { userId, boardId } = req.params;
    const { cursor = null, limit } = req.query;

    // 인증 미들웨어가 있으면 req.user에서 viewerId 사용
    const viewerId = req.user?.mongoId || null;

    const result = await getUserBoardPageData({
      userId,
      boardId,
      viewerId,
      cursor,
      limit,
    });

    if (!result.success) {
      return res.status(getStatusByErrorCode(result.error.code)).json({
        message: result.error.message,
        code: result.error.code,
      });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    console.error("[getUserBoardPage] unexpected error:", error);

    return res.status(500).json({
      message: "보드 페이지 데이터를 불러오지 못했습니다.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

module.exports = {
  getUserBoards,
  getUserBoardPage,
};
