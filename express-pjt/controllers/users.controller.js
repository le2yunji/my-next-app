const { getFeedItems } = require("../services/feed.service");
const {
  attachAbsoluteMediaUrl,
  toPostThumbnailItem,
} = require("../mappers/feed.mapper");

// 유저 피드 그리드 : 썸네일 목록
function getUserFeed(req, res) {
  try {
    const userId = req.params.userId;
    const feedItems = getFeedItems();

    const filtered = feedItems.filter((p) => p.author.id === userId);

    const parsed = parseInt(req.query.limit || "9", 10);
    const limit = Math.min(Number.isNaN(parsed) ? 9 : parsed, 50);
    const cursor = req.query.cursor || null;

    let startIndex = 0;
    if (cursor) {
      const idx = filtered.findIndex((p) => p.id === cursor);
      startIndex = idx >= 0 ? idx + 1 : 0;
    }

    const page = filtered.slice(startIndex, startIndex + limit);
    const pageWithAbsUrl = attachAbsoluteMediaUrl(page);
    const userItems = pageWithAbsUrl.map(toPostThumbnailItem);

    const last = pageWithAbsUrl[pageWithAbsUrl.length - 1];

    return res.status(200).json({
      items: userItems,
      count: filtered.length,
      nextCursor: last ? last.id : null,
      hasNext: startIndex + limit < filtered.length,
    });
  } catch (error) {
    console.error("[GET_FEED_BY_USER ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = { getUserFeed };
