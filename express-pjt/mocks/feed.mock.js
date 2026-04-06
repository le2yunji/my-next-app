// mocks/feed.mock.js
const { POSTS, POST_MEDIA_MAP, POST_LIKE_MAP } = require("./posts.mock");
const { USER_MAP } = require("./users.mock");
const { resolveProfileImageUrl } = require("../constants/image-paths");

const sortByCreatedAtDesc = (items) => {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

const sortByOrderAsc = (items) => {
  return [...items].sort((a, b) => a.order - b.order);
};

// 홈 피드용 작성자 mock shape 생성
const toFeedAuthor = (user) => {
  if (!user) {
    return {
      id: null,
      name: "알 수 없음",
      profileImageUrl: resolveProfileImageUrl(null),
    };
  }

  return {
    id: user.id,
    nickname: user.nickname,
    name: user.name,
    profileImageUrl: resolveProfileImageUrl(user.profileImageUrl),
  };
};

// viewerId 기준 likedByMe까지 반영한 홈 피드 원본 데이터 생성
const createFeedItems = (viewerId) => {
  return sortByCreatedAtDesc(POSTS).map((post) => {
    const author = USER_MAP[post.authorId] || null;
    const mediaList = sortByOrderAsc(POST_MEDIA_MAP[post.id] || []);
    const likeList = POST_LIKE_MAP[post.id] || [];

    return {
      id: post.id,
      author: toFeedAuthor(author),
      content: post.content,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      likedByMe: viewerId
        ? likeList.some((like) => like.userId === viewerId)
        : false,
      createdAt: post.createdAt,
      media: mediaList.map((media, index) => ({
        id: media.id,
        type: media.type,
        thumbnailUrl: media.thumbnailUrl || media.url,
        displayUrl: media.url,
        width: media.width,
        height: media.height,
        order: media.order ?? index + 1,
      })),
    };
  });
};

module.exports = {
  createFeedItems,
};
