// controllers/feed.controller.js
const { getFeedItems } = require("../services/feed.service");
const { attachAbsoluteMediaUrl } = require("../mappers/feed.mapper");

function getFeed(req, res) {
  try {
    const feedItems = attachAbsoluteMediaUrl(getFeedItems()); // 이미지 url
    const parsed = parseInt(req.query.limit || "10", 10);
    const limit = Math.min(Number.isNaN(parsed) ? 10 : parsed, 50);
    const cursor = req.query.cursor || null;

    let startIndex = 0;
    if (cursor) {
      const idx = feedItems.findIndex((p) => p.id === cursor);
      startIndex = idx >= 0 ? idx + 1 : 0;
    }

    const items = feedItems.slice(startIndex, startIndex + limit);
    const last = items[items.length - 1];

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

function getFeedByUser(req, res) {
  try {
    const userId = req.params.userId;
    const feedItems = attachAbsoluteMediaUrl(getFeedItems());

    const items = feedItems
      .filter((p) => p.author.id === userId)
      .map((p) => {
        const thumb = p.media?.[0] ?? null; // ✅ 대표 1장
        return {
          id: p.id,
          author: p.author,
          createdAt: p.createdAt,
          // likeCount: p.likeCount,
          // commentCount: p.commentCount,
          // 그리드용 대표 썸네일만
          thumbnail: thumb ? { type: thumb.type, url: thumb.url } : null,
          // 멀티 여부 표시 (UI에서 겹침 아이콘)
          mediaCount: p.media?.length ?? 0,
        };
      });

    const parsed = parseInt(req.query.limit || "9", 10);
    const limit = Math.min(Number.isNaN(parsed) ? 9 : parsed, 50);
    const cursor = req.query.cursor || null;

    let startIndex = 0;

    if (cursor) {
      const idx = items.findIndex((p) => p.id === cursor);
      startIndex = idx >= 0 ? idx + 1 : 0;
    }

    const userItems = items.slice(startIndex, startIndex + limit);
    const last = userItems[userItems.length - 1];

    return res.status(200).json({
      items: userItems,
      count: items.length,
      nextCursor: last ? last.id : null,
      hasNext: startIndex + limit < items.length,
    });
  } catch (error) {
    console.error("[GET_FEED_BY_USER ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = { getFeed, getFeedByUser };
