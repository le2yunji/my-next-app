// services/feed.service.js
const Post = require("../models/post.model");
const mongoose = require("mongoose");

async function getFeedListData({ cursor = null, limit = 10 }) {
  const query = { isDeleted: false };

  if (cursor) {
    if (!mongoose.Types.ObjectId.isValid(cursor)) {
      throw new Error("유효하지 않은 cursor 입니다.");
    }
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  const safeLimit = Math.max(1, Math.min(Number(limit) || 10, 50));
  const posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(safeLimit + 1) // 1개 더 가져와서 다음 페이지 여부 확인
    .populate({
      path: "authorId",
      select: "userId name profileImage",
      match: { isDeleted: false },
    })
    .lean();

  const hasNext = posts.length > safeLimit;
  const sliced = hasNext ? posts.slice(0, safeLimit) : posts;
  const nextCursor = hasNext ? String(sliced[sliced.length - 1]._id) : null;

  return {
    success: true,
    data: {
      items: sliced,
      pageInfo: {
        nextCursor,
        hasNext,
      },
    },
  };
}

module.exports = { getFeedListData };
