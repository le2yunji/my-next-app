const AUTHORS = [
  { id: "user_1", nickname: "철수", profileImage: null },
  { id: "user_2", nickname: "민수", profileImage: null },
  { id: "user_3", nickname: "지현", profileImage: null },
  { id: "user_4", nickname: "현우", profileImage: null },
  { id: "user_5", nickname: "수빈", profileImage: null },
];

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const FEED_ITEMS = Array.from({ length: 30 }).map((_, i) => {
  const num = 30 - i;
  const author = AUTHORS[i % AUTHORS.length];

  // 🔥 게시물당 1~4장 랜덤 이미지
  const mediaCount = random(1, 4);

  const media = Array.from({ length: mediaCount }).map((_, idx) => ({
    id: `post_${num}_media_${idx}`,
    type: "image",
    url: `/static/images/feed/${random(1, 30)}.webp`,
    order: idx,
  }));

  return {
    id: `post_${num}`,
    author,
    content: `더미 게시글 ${num}번입니다.`,
    media,
    likeCount: random(0, 200),
    commentCount: random(0, 40),
    viewer: {
      likedByMe: Math.random() < 0.3,
    },
    createdAt: new Date(Date.now() - i * 1000 * 60 * 5).toISOString(),
  };
});

module.exports = { FEED_ITEMS };
