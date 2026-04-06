// mappers/user.mapper.js
const { resolveProfileImageUrl } = require("../constants/image-paths");

// 게시물 작성자/댓글 작성자 같은 간단한 유저 정보를 응답용으로 변환
const toAuthorResponse = (user) => {
  if (!user) return null;

  return {
    id: String(user._id ?? ""),
    userId: user.id ?? "",
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

  const userId = user.id ?? "";

  return {
    id: String(user._id ?? ""),
    userId,
    name: user.name ?? "",
    profileImage: resolveProfileImageUrl(
      user.profileImage ?? user.profileImageUrl ?? null
    ),
    bio: user.bio ?? "",
    postCount,
    followerCount,
    followingCount,
    isMe: viewerId === userId,
    isFollowing,
  };
};

const toUserProfileSummaryResponse = ({ user }) => ({
  id: String(user._id ?? ""),
  userId: user.id ?? "",
  name: user.name ?? "",
  profileImage: resolveProfileImageUrl(
    user.profileImage ?? user.profileImageUrl ?? null
  ),
});

module.exports = {
  toUserProfileResponse,
  toAuthorResponse,
  toUserProfileSummaryResponse,
};
