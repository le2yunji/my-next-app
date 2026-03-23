// controllers/feed.controller.js
const { getFeedListData } = require("../services/feed.service");
const {
  attachAbsoluteMediaUrl,
  toPostThumbnailItem,
} = require("../mappers/feed.mapper");

// 홈 피드 목록 : 요약 Data
function getFeed(req, res) {
  try {
    const viewerId = req.user?.id || null;

    const parsed = parseInt(req.query.limit || "10", 10);
    const limit = Math.min(Number.isNaN(parsed) ? 10 : parsed, 50);
    const cursor = req.query.cursor || null;

    const result = getFeedListData({
      viewerId,
      cursor,
      limit,
    });

    if (!result.success) {
      return res.status(400).json({
        code: result.error?.code ?? "BAD_REQUEST",
        message: result.error?.message ?? "피드를 불러오지 못했습니다.",
      });
    }
    const { items, pageInfo } = result.data;
    const itemsWithAbsUrl = attachAbsoluteMediaUrl(items);

    return res.status(200).json({
      items: itemsWithAbsUrl.map(toPostThumbnailItem),
      nextCursor: pageInfo.nextCursor,
      hasNext: pageInfo.hasNext,
    });
  } catch (error) {
    console.error("[GET_FEED ERROR]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}

module.exports = { getFeed };
