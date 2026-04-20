// services/follow.service.js
const {
  existsFollowRelation,
  createFollowRelation,
  deleteFollowRelation,
} = require("../repositories/follow.repository");
const { findUserByUserId } = require("../repositories/user.repository");

/**
 * 팔로우 토글 (팔로우 중이면 언팔로우, 아니면 팔로우)
 * @param {Object} params
 * @param {string} params.followerMongoId - 팔로우를 요청한 사용자의 MongoDB _id
 * @param {string} params.targetUserId    - 팔로우 대상 사용자의 서비스 userId (e.g. "user_123")
 * @returns {Promise<{ isFollowing: boolean }>} 토글 후 팔로우 상태
 */
const toggleFollow = async ({ followerMongoId, targetUserId }) => {
  // 팔로우 대상 사용자 존재 여부 확인
  const targetUser = await findUserByUserId(targetUserId);

  if (!targetUser) {
    const err = new Error("존재하지 않는 사용자입니다.");
    err.status = 404;
    throw err;
  }

  // 자기 자신을 팔로우하는 경우 차단
  if (String(followerMongoId) === String(targetUser._id)) {
    const err = new Error("자기 자신을 팔로우할 수 없습니다.");
    err.status = 400;
    throw err;
  }

  const followingMongoId = targetUser._id;

  // 이미 팔로우 관계가 존재하는지 확인
  const alreadyFollowing = await existsFollowRelation({
    followerMongoId,
    followingMongoId,
  });

  if (alreadyFollowing) {
    // 이미 팔로우 중이면 언팔로우 처리
    await deleteFollowRelation({ followerMongoId, followingMongoId });
    return { isFollowing: false };
  } else {
    // 팔로우 관계가 없으면 새로 팔로우 생성
    await createFollowRelation({ followerMongoId, followingMongoId });
    return { isFollowing: true };
  }
};

module.exports = { toggleFollow };
