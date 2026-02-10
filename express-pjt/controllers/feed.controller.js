// controllers/feed.controller.js
const { getFeedItems } = require("../services/feed.service");

exports.getFeed = (req, res) => {
  try {
    // service에서 목데이터 불러오기
    const FEED_ITEMS = getFeedItems();

    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);
    const cursor = req.query.cursor || null;

    let startIndex = 0;
    if (cursor) {
      const idx = FEED_ITEMS.findIndex((p) => p.id === cursor);
      startIndex = idx >= 0 ? idx + 1 : 0;
    }

    const items = FEED_ITEMS.slice(startIndex, startIndex + limit);
    const last = items[items.length - 1];

    return res.status(200).json({
      items,
      nextCursor: last ? last.id : null,
      hasNext: startIndex + limit < FEED_ITEMS.length,
    });
  } catch (error) {
    console.error("[GET_FEED ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

exports.getFeedByUser = (req, res) => {
  try {
    const userId = req.params.userId;
    const FEED_ITEMS = getFeedItems();

    const posts = FEED_ITEMS.filter((p) => p.author.id === userId);

    return res.status(200).json({
      items: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("[GET_FEED_BY_USER ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
