const { FEED_ITEMS } = require("../mocks/feed.mock");

exports.getFeed = (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || "10", 10));
  const cursor = req.query.cursor || null;

  let startIndex = 0;
  if (cursor) {
    const idx = FEED_ITEMS.findIndex((p) => p.id === cursor);
    startIndex = idx >= 0 ? idx + 1 : 0;
  }

  const items = FEED_ITEMS.slice(startIndex, startIndex + limit);
  const last = items[items.length - 1];

  return res.json({
    items,
    nextCursor: last ? last.id : null,
    hasNext: startIndex + limit < FEED_ITEMS.length,
  });
};

exports.getFeedById = (req, res) => {
  const post = FEED_ITEMS.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ message: "post not found" });
  return res.json(post);
};
