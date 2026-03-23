const { createFollow } = require("./helpers/mock.helpers");

const followPairSet = new Set();

for (let i = 1; i <= 20; i += 1) {
  const followerId = `user_${i}`;
  const followCount = (i % 4) + 1;

  for (let offset = 1; offset <= followCount; offset += 1) {
    const followingNo = ((i + offset - 1) % 20) + 1;
    const followingId = `user_${followingNo}`;

    if (followerId !== followingId) {
      followPairSet.add(`${followerId}->${followingId}`);
    }
  }
}

[
  "user_6->user_1",
  "user_7->user_1",
  "user_8->user_1",
  "user_9->user_1",
  "user_10->user_1",
  "user_1->user_12",
  "user_1->user_15",
  "user_3->user_10",
  "user_4->user_2",
  "user_11->user_5",
  "user_14->user_3",
  "user_18->user_7",
].forEach((pair) => followPairSet.add(pair));

const baseTime = Date.UTC(2026, 2, 1, 0, 0, 0);

const FOLLOWS = Array.from(followPairSet).map((pair, index) => {
  const [followerId, followingId] = pair.split("->");

  return createFollow({
    followerId,
    followingId,
    createdAt: new Date(baseTime + index * 60 * 60 * 1000).toISOString(),
  });
});

module.exports = {
  FOLLOWS,
};
