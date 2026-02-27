const PUBLIC_ASSET_BASE_URL =
  process.env.PUBLIC_ASSET_BASE_URL || "http://localhost:8080";

function attachAbsoluteMediaUrl(items) {
  return items.map((item) => ({
    ...item,
    media: item.media?.map((m) => ({
      ...m,
      url: m.url.startsWith("http")
        ? m.url
        : `${PUBLIC_ASSET_BASE_URL}${m.url}`,
    })),
  }));
}
module.exports = { attachAbsoluteMediaUrl };
