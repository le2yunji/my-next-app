// services/user-profile.servise.js
const {
  getUserById,
  getPostsByUserId,
  getFollowersByUserId,
  getFollowingsByUserId,
  isFollowingUser,
} = require("../selectors/user.selectors");

const { getMediaByPostId } = require("../selectors/post.selectors");
const { paginateByCursor } = require("../utils/pagination");

// 원본 데이터 변경 없이 최신순 정렬 데이터 생성
const sortPostsByCreatedAtDesc = (posts) => {
  return [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// 유저 1명에 대한 프로필 페이지 데이터를 조회하는 서비스 함수
// 유저 정보, 게시물 목록, 카운트, 팔로우 관계, 페이지네이션 정보를 반환
const getUserProfileData = ({
  userId, // 조회 대상
  viewerId = null, // 현재 로그인 유저
  cursor = null,
  limit = 6,
}) => {
  const user = getUserById(userId);

  if (!user) {
    return {
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "존재하지 않는 사용자입니다.",
      },
    };
  }

  // 해당 유저의 전체 게시물 조회 + 최신순 정렬
  const allPosts = sortPostsByCreatedAtDesc(getPostsByUserId(userId));

  const { pagedItems, pageInfo } = paginateByCursor({
    items: allPosts,
    cursor,
    limit,
  });

  // 게시물별 media 목록까지 같이 묶어줌
  // -> controller에서 mapper로 쉽게 응답 shape 생성 가능
  const postsWithMedia = pagedItems.map((post) => ({
    post,
    mediaList: getMediaByPostId(post.id),
  }));

  // 유저 관련 집계값 계산
  const postCount = allPosts.length;
  const followerCount = getFollowersByUserId(user.userId).length;
  const followingCount = getFollowingsByUserId(user.userId).length;

  // 로그인 유저 기준 팔로우 여부 계산
  const isFollowing =
    viewerId && viewerId !== user.userId
      ? isFollowingUser({
          followerId: viewerId,
          followingId: user.id,
        })
      : false;

  return {
    success: true,
    data: {
      user, // 프로필 원본 데이터
      posts: postsWithMedia, // 게시물 + media 원본 데이터
      counts: {
        postCount,
        followerCount,
        followingCount,
      },
      relationship: {
        isFollowing,
      },
      pageInfo,
    },
  };
};

module.exports = { getUserProfileData };
