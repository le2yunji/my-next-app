const { USER_MAP } = require("../mocks/users.mock");
const { POSTS } = require("../mocks/posts.mock");
const { FOLLOWS } = require("../mocks/followers.mock");

// 특정 유저 1인 찾기
const getUserById = (userId) => {
  return USER_MAP[userId] || null;
};
// 유저가 쓴 게시물 목록 찾기
const getUsersByIds = (userIds = []) => {
  return userIds.map((userId) => USER_MAP[userId]).filter(Boolean);
};
// 유저가 쓴 게시물 목록 찾기
const getPostsByUserId = (userId) => {
  return POSTS.filter((post) => post.authorId === userId);
};
// 유저를 팔로우하는 사람들 찾기
const getFollowersByUserId = (userId) => {
  return FOLLOWS.filter((follow) => follow.followingId === userId);
};
// 유저가 팔로우하는 사람들 찾기
const getFollowingsByUserId = (userId) => {
  return FOLLOWS.filter((follow) => follow.followerId === userId);
};
// 현재 로그인 중인 유저가 이 유저를 팔로우하는 중인지 확인
const isFollowingUser = ({ followerId, followingId }) => {
  if (!followerId || !followingId) return false;

  return FOLLOWS.some(
    (follow) =>
      follow.followerId === followerId && follow.followingId === followingId
  );
};

module.exports = {
  getUserById,
  getUsersByIds,
  getPostsByUserId,
  getFollowersByUserId,
  getFollowingsByUserId,
  isFollowingUser,
};
