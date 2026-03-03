// controllers/feed.controller.js
const { getFeedItems } = require("../services/feed.service");
const { attachAbsoluteMediaUrl } = require("../mappers/feed.mapper");

// 공통: 그리드(리스트)용 최소 필드 + thumbnail로 변환
function toThumbnailItem(p) {
  const thumb = p.media?.[0] ?? null;
  return {
    id: p.id,
    author: p.author,
    createdAt: p.createdAt,
    likeCount: p.likeCount,
    commentCount: p.commentCount,
    thumbnail: thumb ? { type: thumb.type, url: thumb.url } : null,
    mediaCount: p.media?.length ?? 0,
  };
}

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
    const items = pageWithAbsUrl.map(toThumbnailItem);

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

function getFeedByUser(req, res) {
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
    const userItems = pageWithAbsUrl.map(toThumbnailItem);

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

module.exports = { getFeed, getFeedByUser };
