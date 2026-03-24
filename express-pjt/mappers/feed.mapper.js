// mappers/feed.mapper.js
const { toAuthorResponse } = require("./user.mapper");
const { toAbsoluteUrl } = require("../constants/image-paths");

// 게시물 배열의 모든 media 내부 URL을 절대 URL로 바꿔주는 함수
function attachAbsoluteMediaUrl(items = []) {
  return items.map((item) => ({
    ...item,
    media: (item.media ?? []).map((m) => ({
      ...m,
      url: toAbsoluteUrl(m.url),
      thumbnailUrl: toAbsoluteUrl(m.thumbnailUrl),
      displayUrl: toAbsoluteUrl(m.displayUrl),
      fullUrl: toAbsoluteUrl(m.fullUrl),
    })),
  }));
}

// 공통: 그리드(리스트)용 최소 필드 + thumbnail로 변환
function toPostThumbnailItem(p) {
  const thumb = p.media?.[0] ?? null;
  return {
    id: p.id,
    author: p.author ? toAuthorResponse(p.author) : null,
    createdAt: p.createdAt,
    likeCount: p.likeCount,
    commentCount: p.commentCount,
    likedByMe: p.likedByMe,
    thumbnail: thumb
      ? {
          type: thumb.type,
          url:
            thumb.thumbnailUrl ??
            thumb.displayUrl ??
            thumb.fullUrl ??
            thumb.url ??
            null,
        }
      : null,
    mediaCount: p.media?.length ?? 0,
  };
}

module.exports = { attachAbsoluteMediaUrl, toPostThumbnailItem };
