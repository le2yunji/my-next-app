function createMedia(postId, imageNo, width = 1080, height = 1350) {
  const imageUrl = `/static/images/feed/${imageNo}.webp`;

  return {
    id: `post_${postId}_media_${imageNo}`,
    type: "image",
    thumbnailUrl: imageUrl,
    displayUrl: imageUrl,
    fullUrl: imageUrl,
    width,
    height,
  };
}

module.exports = { createMedia };
