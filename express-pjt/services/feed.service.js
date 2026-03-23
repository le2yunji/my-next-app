// services/feed.service.js

const { createFeedItems } = require("../mocks/feed.mock");
const { paginateByCursor } = require("../utils/pagination");

// 홈 피드 목록용 raw data 반환
const getFeedListData = ({ viewerId = null, cursor = null, limit = 10 }) => {
  const allFeedItems = createFeedItems(viewerId);

  const { pagedItems, pageInfo } = paginateByCursor({
    items: allFeedItems,
    cursor,
    limit,
  });

  return {
    success: true,
    data: {
      items: pagedItems,
      pageInfo,
    },
  };
};

module.exports = {
  getFeedListData,
};
