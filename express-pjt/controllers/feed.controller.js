// controllers/feed.controller.js
const { getFeedItems } = require("../services/feed.service");
const {
  attachAbsoluteMediaUrl,
  toPostThumbnailItem,
} = require("../mappers/feed.mapper");

// 홈 피드 목록 : 요약 Data
function getFeed(req, res) {
  try {
    const feedItems = getFeedItems();

    const parsed = parseInt(req.query.limit || "10", 10);
    const limit = Math.min(Number.isNaN(parsed) ? 10 : parsed, 50);
    const cursor = req.query.cursor || null;

    let startIndex = 0;
    if (cursor) {
      const idx = feedItems.findIndex((p) => p.id === cursor);
      startIndex = idx >= 0 ? idx + 1 : 0;
    }

    // slice 후에 thumbnail projection 적용
    const page = feedItems.slice(startIndex, startIndex + limit);
    const pageWithAbsUrl = attachAbsoluteMediaUrl(page);
    const items = pageWithAbsUrl.map(toPostThumbnailItem);

    const last = pageWithAbsUrl[pageWithAbsUrl.length - 1];

    return res.status(200).json({
      items,
      nextCursor: last ? last.id : null,
      hasNext: startIndex + limit < feedItems.length,
    });
  } catch (error) {
    console.error("[GET_FEED ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = { getFeed };
