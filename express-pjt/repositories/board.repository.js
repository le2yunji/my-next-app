const Board = require("../models/board.model");
const mongoose = require("mongoose");

/** ownerId에 해당하는 보드 전체 조회 (삭제되지 않은 것만) */
async function findAllBoardsByOwnerId({ ownerId, visibility = null }) {
  const query = { ownerId, isDeleted: false };
  if (visibility) query.visibility = visibility;
  return Board.find(query).sort({ updatedAt: -1, _id: -1 }).lean();
}

async function findBoardsPageByOwnerId({
  ownerId,
  visibility = null,
  cursor = null,
  limit,
}) {
  const query = {
    ownerId,
    isDeleted: false,
  };

  if (visibility) {
    query.visibility = visibility;
  }

  if (cursor) {
    query.$or = [
      { updatedAt: { $lt: cursor.updatedAt } },
      {
        updatedAt: cursor.updatedAt,
        _id: { $lt: new mongoose.Types.ObjectId(cursor.id) },
      },
    ];
  }

  return Board.find(query)
    .sort({ updatedAt: -1, _id: -1 })
    .limit(limit + 1)
    .lean();
}

async function findBoardByIdAndOwnerId({ boardId, ownerId }) {
  return Board.findOne({
    _id: boardId,
    ownerId,
    isDeleted: false,
  }).lean();
}

module.exports = {
  findAllBoardsByOwnerId,
  findBoardsPageByOwnerId,
  findBoardByIdAndOwnerId,
};
