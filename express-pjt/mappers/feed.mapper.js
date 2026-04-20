// mappers/feed.mapper.js
const { toUserResponse } = require("./user.mapper");
const { toAbsoluteUrl } = require("../constants/image-paths");

function attachAbsoluteMediaUrl(items = []) {
  return items.map((item) => ({
    ...item,
    media: [...(item.media ?? [])]
      .sort((a, b) => a.order - b.order)
      .map((m) => ({
        ...m,
        url: toAbsoluteUrl(m.url),
        thumbnailUrl: toAbsoluteUrl(m.thumbnailUrl),
        displayUrl: toAbsoluteUrl(m.displayUrl),
        fullUrl: toAbsoluteUrl(m.fullUrl),
      })),
  }));
}

function toPostThumbnailItem(p) {
  const media = p.media ?? [];

  return {
    id: String(p._id ?? p.id),
    content: p.content ?? "",
    author: p.authorId ? toUserResponse(p.authorId) : null,
    createdAt: p.createdAt,
    likeCount: p.likeCount ?? 0,
    commentCount: p.commentCount ?? 0,
    // media[0]이 썸네일 역할, 전체 배열로 스와이프 캐러셀 지원
    media: media.map((m) => ({
      type: m.type,
      url: m.displayUrl ?? m.fullUrl ?? m.url ?? null,
      order: m.order,
    })),
    mediaCount: media.length,
  };
}

module.exports = { attachAbsoluteMediaUrl, toPostThumbnailItem };
