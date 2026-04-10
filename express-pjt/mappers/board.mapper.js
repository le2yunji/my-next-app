function toBoardPreviewImage(item) {
  return {
    id: String(item._id),
    url: item.thumbnailUrl,
  };
}

function toBoardListItem(board, previewImages = [], isOwner = false) {
  return {
    id: String(board._id),
    ownerId: String(board.ownerId),
    title: board.title,
    description: board.description ?? "",
    coverImage: board.coverImage ?? null,
    visibility: board.visibility,
    itemCount: board.itemCount ?? 0,
    previewImages,
    isOwner,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
  };
}

function toBoardDetailResponse(board, isOwner = false) {
  return {
    id: String(board._id),
    ownerId: String(board.ownerId),
    title: board.title,
    description: board.description ?? "",
    coverImage: board.coverImage ?? null,
    visibility: board.visibility,
    itemCount: board.itemCount ?? 0,
    isOwner,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt,
  };
}

function toBoardItemResponse(item) {
  return {
    id: String(item._id),
    boardId: String(item.boardId),
    ownerId: String(item.ownerId),
    postId: String(item.postId),
    thumbnailUrl: item.thumbnailUrl ?? null,
    savedMediaOrder: item.savedMediaOrder ?? null,
    note: item.note ?? "",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function buildBoardPreviewImageMap(boardItems, maxImages = 3) {
  const previewMap = new Map();

  for (const item of boardItems) {
    if (!item.thumbnailUrl) continue;

    const key = String(item.boardId);

    if (!previewMap.has(key)) {
      previewMap.set(key, []);
    }

    const current = previewMap.get(key);

    if (current.length < maxImages) {
      current.push(toBoardPreviewImage(item));
    }
  }

  return previewMap;
}

module.exports = {
  toBoardListItem,
  toBoardDetailResponse,
  toBoardItemResponse,
  buildBoardPreviewImageMap,
};
