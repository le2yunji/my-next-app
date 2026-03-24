// mappers/user.mapper.js
const { resolveProfileImageUrl } = require("../constants/image-paths");

// 게시물 작성자/댓글 작성자 같은 간단한 유저 정보를 응답용으로 변환
const toAuthorResponse = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    nickname: user.nickname,
    name: user.name,
    profileImageUrl: resolveProfileImageUrl(user.profileImageUrl),
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
  return {
    id: user.id,
    nickname: user.nickname,
    name: user.name,
    profileImageUrl: resolveProfileImageUrl(user.profileImageUrl),
    bio: user.bio,
    postCount,
    followerCount,
    followingCount,
    isMe: viewerId === user.id,
    isFollowing,
  };
};

const toUserProfileSummaryResponse = ({ user }) => ({
  id: user.id,
  nickname: user.nickname,
  profileImageUrl: user.profileImageUrl ?? null,
});

module.exports = {
  toUserProfileResponse,
  toAuthorResponse,
  toUserProfileSummaryResponse,
};
