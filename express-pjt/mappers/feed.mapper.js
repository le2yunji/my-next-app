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
  const thumb = media[0] ?? null;

  return {
    id: String(p._id ?? p.id),
    content: p.content ?? "",
    author: p.authorId ? toUserResponse(p.authorId) : null,
    createdAt: p.createdAt,
    likeCount: p.likeCount ?? 0,
    commentCount: p.commentCount ?? 0,
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
    mediaCount: media.length,
  };
}

module.exports = { attachAbsoluteMediaUrl, toPostThumbnailItem };
