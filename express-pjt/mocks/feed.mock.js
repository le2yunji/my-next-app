// feed.mock.js
const { POSTS } = require("../data/posts.data");

const FEED_ITEMS = POSTS.map((post) => ({
  id: post.id,
  author: post.author,
  content: post.content,
  likeCount: post.likeCount,
  commentCount: post.commentCount,
  likedByMe: post.likedByMe,
  createdAt: post.createdAt,
  media: post.media.map((m, index) => ({
    id: m.id,
    type: m.type,
    thumbnailUrl: m.thumbnailUrl,
    width: m.width,
    height: m.height,
    order: index,
  })),
}));

module.exports = { FEED_ITEMS };
