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
const toUserProfileResponse = ({
  user,
  viewerId = null,
  postCount,
  followerCount,
  followingCount,
  isFollowing,
}) => {
  if (!user) return null;

  const userId = user.userId ?? "";

  return {
    id: String(user._id ?? ""),
    userId,
    name: user.name ?? "",
    profileImage: resolveProfileImageUrl(
      user.profileImage ?? user.profileImageUrl ?? null
    ),
    bio: user.bio ?? "",
    postCount,
    boardCount,
    interestCategories,
    customInterestCategories,
    followerCount,
    followingCount,
    isMe: viewerId === userId,
    isFollowing,
  };
};

// 유저 프로필 요약 데이터
const toUserProfileSummaryResponse = ({ user, viewerId = null }) => {
  if (!user) return null;
  const userId = user.userId ?? "";
  return {
    id: String(user._id ?? ""),
    userId,
    name: user.name ?? "",
    profileImage: resolveProfileImageUrl(
      user.profileImage ?? user.profileImageUrl ?? null
    ),
    isMe: viewerId === userId,
  };
};

module.exports = {
  toUserProfileResponse,
  toAuthorResponse,
  toUserProfileSummaryResponse,
};
