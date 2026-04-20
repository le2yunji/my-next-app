const Follow = require("../models/follow.model");

/**
 * 특정 유저를 팔로우하는 사람 수 조회
 * followerCount와 맞는지 검증용으로도 쓸 수 있음
 */
const countFollowersByUserMongoId = (userMongoId) => {
  return Follow.countDocuments({
    followingId: userMongoId,
  });
};

/**
 * 특정 유저가 팔로우하는 사람 수 조회
 */
const countFollowingsByUserMongoId = (userMongoId) => {
  return Follow.countDocuments({
    followerId: userMongoId,
  });
};

/**
 * 현재 로그인 유저가 대상 유저를 팔로우 중인지 확인
 */
const existsFollowRelation = ({ followerMongoId, followingMongoId }) => {
  return Follow.exists({
    followerId: followerMongoId,
    followingId: followingMongoId,
  });
};

/**
 * 팔로우 생성
 */
const createFollowRelation = ({ followerMongoId, followingMongoId }) => {
  return Follow.create({
    followerId: followerMongoId,
    followingId: followingMongoId,
  });
};

/**
 * 팔로우 삭제
 */
const deleteFollowRelation = ({ followerMongoId, followingMongoId }) => {
  return Follow.deleteOne({
    followerId: followerMongoId,
    followingId: followingMongoId,
  });
};

module.exports = {
  countFollowersByUserMongoId,
  countFollowingsByUserMongoId,
  existsFollowRelation,
  createFollowRelation,
  deleteFollowRelation,
};
