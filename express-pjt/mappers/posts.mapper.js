function createAuthor(id, nickname, profileNo) {
  return {
    id: `user_${id}`,
    nickname,
    profileImageUrl: `/static/profiles/${profileNo}.webp`,
  };
}

function createMedia(postId, imageNo, width = 1080, height = 1350) {
  const imageUrl = `/static/feed/${imageNo}.webp`;

  return {
    id: `post_${postId}`,
    type: "image",
    thumbnailUrl: imageUrl,
    displayUrl: imageUrl,
    fullUrl: imageUrl,
    width,
    height,
  };
}

module.exports = { createAuthor, createMedia };
