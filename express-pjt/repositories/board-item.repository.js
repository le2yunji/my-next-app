const BoardItem = require("../models/boardItems.model");

async function findBoardPreviewItemsByBoardIds({ boardIds }) {
  return BoardItem.find({
    boardId: { $in: boardIds },
    isDeleted: false,
  })
    .sort({ createdAt: -1, _id: -1 })
    .select("_id boardId thumbnailUrl")
    .lean();
}

async function findBoardItemsPageByBoardId({
  boardId,
  cursorObjectId = null,
  limit,
}) {
  const query = {
    boardId,
    isDeleted: false,
  };

  if (cursorObjectId) {
    query._id = { $lt: cursorObjectId };
  }

  return BoardItem.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .select(
      "_id boardId ownerId postId thumbnailUrl savedMediaOrder note createdAt updatedAt",
    )
    .lean();
}

module.exports = {
  findBoardPreviewItemsByBoardIds,
  findBoardItemsPageByBoardId,
};
