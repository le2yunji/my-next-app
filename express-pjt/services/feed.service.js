// services/feed.service.js
const Post = require("../models/post.model");
const mongoose = require("mongoose");
const { countCommentsByPostIds } = require("../repositories/comment.repository")
const { findLikedPostIdSet } = require("../repositories/post-like.repository");

async function getFeedListData({ cursor = null, limit = 10, viewerId = null }) {
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

  const postIds = sliced.map((p) => p._id);

  // 댓글 수 집계 + 로그인 유저의 좋아요 여부를 한 번에 처리
  const [commentCountMap, likedPostIdSet] = await Promise.all([
    countCommentsByPostIds(postIds),
    viewerId ? findLikedPostIdSet({ userId: viewerId, postIds }) : Promise.resolve(new Set()),
  ]);

  const itemsWithCommentCount = sliced.map((p) => ({
    ...p,
    commentCount: commentCountMap[String(p._id)] ?? 0,
    isLiked: likedPostIdSet.has(String(p._id)),
  }));

  return {
    success: true,
    data: {
      items: itemsWithCommentCount,
      pageInfo: {
        nextCursor,
        hasNext,
      },
    },
  };
}

module.exports = { getFeedListData };
