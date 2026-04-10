// mappers/user.mapper.js
const { resolveProfileImageUrl } = require("../constants/image-paths");

// 간단한 유저 정보를 응답용으로 변환
const toUserResponse = (user) => {
  if (!user) return null;

  return {
    id: String(user._id ?? ""),
    userId: user.userId ?? "",
    name: user.name ?? "",
    profileImage: resolveProfileImageUrl(
      user.profileImage ?? user.profileImageUrl ?? null
    ),
  };
};

// 상세 프로필 응답 생성 함수
// isFollowing은 service 레이어에서 계산 후 전달받음
const toUserProfileResponse = ({
  user,
  viewerId = null,
  isFollowing = false,
}) => {
  if (!user) return null;

  return {
    id: String(user._id ?? ""),
    userId: user.userId ?? "",
    name: user.name ?? "",
    profileImage: resolveProfileImageUrl(
      user.profileImage ?? user.profileImageUrl ?? null
    ),
    bio: user.bio ?? "",
    postCount: user.postCount,
    boardCount: user.boardCount ?? 0,
    interestCategories: user.interestCategories ?? [],
    customInterestCategories: user.customInterestCategories ?? [],
    followerCount: user.followerCount,
    followingCount: user.followingCount,
    isMe: viewerId ? String(viewerId) === String(user._id) : false,
    isFollowing,
  };
};

// 유저 프로필 요약 데이터
const toUserProfileSummaryResponse = ({ user, viewerId = null }) => {
  if (!user) return null;

  return {
    id: String(user._id ?? ""),
    userId: user.userId ?? "",
    name: user.name ?? "",
    profileImage: resolveProfileImageUrl(
      user.profileImage ?? user.profileImageUrl ?? null
    ),
    isMe: viewerId ? String(viewerId) === String(user._id) : false,
  };
};

module.exports = {
  toUserProfileResponse,
  toUserResponse,
  toUserProfileSummaryResponse,
};
