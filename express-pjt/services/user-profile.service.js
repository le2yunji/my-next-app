// services/user-profile.service.js
const {
  findActiveUserSummaryByUserId,
  findUserProfileByUserId,
} = require("../repositories/user.repository");

const {
  findActivePostsByAuthorId,
} = require("../repositories/post.repository");

const {
  countFollowersByUserMongoId,
  countFollowingsByUserMongoId,
  existsFollowRelation,
} = require("../repositories/follow.repository");

const { paginateByCursor } = require("../utils/pagination");

/**
 * 반환:
 * - 유저 정보
 * - 게시물 목록(각 post의 media 포함)
 * - 카운트 정보
 * - 현재 로그인 유저 기준 팔로우 여부
 * - 페이지네이션 정보
 */
const getUserProfileData = async ({
  userId, // 공개용 userId (예: lee_00)
  viewerId = null, // 현재 로그인 유저의 mongoId
  cursor = null,
  limit = 6,
}) => {
  // 1) 대상 유저 조회
  const user = await findUserProfileByUserId(userId);

  if (!user) {
    return {
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "존재하지 않는 사용자입니다.",
      },
    };
  }

  // 2) 대상 유저 게시물 전체 조회
  // posts는 User._id(authorId) 기준으로 찾아야 함
  const allPosts = await findActivePostsByAuthorId(user._id);

  // 3) 페이지네이션
  const { pagedItems, pageInfo } = paginateByCursor({
    items: allPosts,
    cursor,
    limit,
  });

  // 4) Post.media는 내장 배열이므로 별도 media 조회 불필요
  const postsWithMedia = pagedItems.map((post) => ({
    post,
    mediaList: post.media ?? [],
  }));

  // 5) 카운트
  // 이미 user 문서에 followerCount, followingCount, postCount가 있다면
  // 그 값을 그대로 써도 되지만, 여기서는 repository 기준으로 다시 계산
  const [followerCount, followingCount] = await Promise.all([
    countFollowersByUserMongoId(user._id),
    countFollowingsByUserMongoId(user._id),
  ]);

  const postCount = allPosts.length;

  // 6) 로그인 유저 기준 팔로우 여부
  const isFollowing =
    viewerId && String(viewerId) !== String(user._id)
      ? !!(await existsFollowRelation({
          followerMongoId: viewerId,
          followingMongoId: user._id,
        }))
      : false;

  return {
    success: true,
    data: {
      user,
      posts: postsWithMedia,
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
