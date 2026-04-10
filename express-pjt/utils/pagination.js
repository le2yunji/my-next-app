const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 30;

function normalizeLimit(limit) {
  const parsed = Number(limit);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT;
  }

  return Math.min(Math.floor(parsed), MAX_LIMIT);
}

function toCursorPage(items, limit) {
  const hasNext = items.length > limit;
  const pageItems = hasNext ? items.slice(0, limit) : items;
  const nextCursor =
    hasNext && pageItems.length > 0
      ? String(pageItems[pageItems.length - 1]._id)
      : null;

  return {
    items: pageItems,
    hasNext,
    nextCursor,
  };
}

// cursor 기반으로 잘라서 items, pageInfo 반환
const paginateByCursor = ({ items = [], cursor = null, limit = 6 }) => {
  const startIndex = cursor
    ? Math.max(items.findIndex((item) => item.id === cursor) + 1, 0)
    : 0;
  const pagedItems = items.slice(startIndex, startIndex + limit);
  const hasNext = startIndex + limit < items.length;
  const nextCursor = hasNext
    ? (pagedItems[pagedItems.length - 1]?.id ?? null)
    : null;

  return {
    pagedItems,
    pageInfo: {
      nextCursor,
      hasNext,
    },
  };
};

module.exports = {
  DEFAULT_LIMIT,
  MAX_LIMIT,
  normalizeLimit,
  toCursorPage,
  paginateByCursor,
};
