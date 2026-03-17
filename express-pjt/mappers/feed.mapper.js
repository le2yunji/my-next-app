// mappers/feed.mapper.js
const PUBLIC_ASSET_BASE_URL =
  process.env.PUBLIC_ASSET_BASE_URL || "http://localhost:8080";

function toAbsoluteUrl(url) {
  if (!url || typeof url !== "string") return url;

  return url.startsWith("http") ? url : `${PUBLIC_ASSET_BASE_URL}${url}`;
}

function attachAbsoluteMediaUrl(items = []) {
  return items.map((item) => ({
    ...item,
    media: (item.media ?? []).map((m) => ({
      ...m,
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
    author: p.author,
    createdAt: p.createdAt,
    likeCount: p.likeCount,
    commentCount: p.commentCount,
    thumbnail: thumb
      ? {
          type: thumb.type,
          url: thumb.thumbnailUrl ?? thumb.displayUrl ?? thumb.fullUrl,
        }
      : null,
    mediaCount: p.media?.length ?? 0,
  };
}

module.exports = { attachAbsoluteMediaUrl, toPostThumbnailItem };
