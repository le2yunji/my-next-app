// mappers/posts.mapper.js
const { resolveFeedImageUrl } = require("../constants/image-paths");

// 미디어 목록 중 첫 번째 미디어를 썸네일 형태로 변환
const toPostThumbnailResponse = (mediaList = []) => {
  if (!mediaList.length) return null;

  const sortedMedia = [...mediaList].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );
  const firstMedia = sortedMedia[0];

  return {
    type: firstMedia.type,
    url:
      resolveFeedImageUrl(firstMedia.thumbnailUrl) ??
      resolveFeedImageUrl(firstMedia.displayUrl) ??
      resolveFeedImageUrl(firstMedia.fullUrl) ??
      resolveFeedImageUrl(firstMedia.url) ??
      null,
  };
};

// 유저 게시물 목록(그리드)용 요약 응답 생성 함수
// users/:userId/feed
const toUserPostItemResponse = ({ post, mediaList = [] }) => {
  return {
    id: post.id,
    thumbnail: toPostThumbnailResponse(mediaList),
    mediaCount: mediaList.length,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
  };
};

module.exports = {
  toPostThumbnailResponse,
  toUserPostItemResponse,
};
