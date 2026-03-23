// cursor 기반으로 잘라서 items, pageInfo 반환
const paginateByCursor = ({ items = [], cursor = null, limit = 6 }) => {
  const startIndex = cursor
    ? Math.max(items.findIndex((item) => item.id === cursor) + 1, 0)
    : 0;
  const pagedItems = items.slice(startIndex, startIndex + limit);
  const hasNext = startIndex + limit < items.length;
  const nextCursor = hasNext
    ? pagedItems[pagedItems.length - 1]?.id ?? null
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
  paginateByCursor,
};
