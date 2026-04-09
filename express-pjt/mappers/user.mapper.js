// mappers/user.mapper.js
const { resolveProfileImageUrl } = require("../constants/image-paths");

// 게시물 작성자/댓글 작성자 같은 간단한 유저 정보를 응답용으로 변환
const toAuthorResponse = (user) => {
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
const toUserProfileResponse = ({ user, viewerId = null }) => {
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
    isFollowing: existsFollowRelation(String(viewerId), user._id),
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
  toAuthorResponse,
  toUserProfileSummaryResponse,
};
