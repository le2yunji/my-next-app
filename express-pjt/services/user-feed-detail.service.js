const {
  getUserById,
  getPostsByUserId,
  getFollowersByUserId,
  getFollowingsByUserId,
  isFollowingUser,
} = require("../selectors/user.selectors");
const { toProfileResponse } = require("../mappers/user.mapper");
const { buildPostDetailBase } = require("./post-detail-base.service");

// 게시물 목록을 최신 순으로 정렬
const sortByCreatedAtDesc = (items) => {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// 유저 프로필 안에서 게시물 상세를 볼 때 필요한 데이터 생성
const getUserFeedDetailData = ({ userId, postId, viewerId }) => {
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

  // 해당 유저의 게시물 목록 찾기 + 최신순 정렬
  const userPosts = sortByCreatedAtDesc(getPostsByUserId(userId));
  // 그 목록 안에서 현재 post 위치 찾기
  const postIndex = userPosts.findIndex((post) => post.id === postId);
  // 그 유저 게시물이 아니면 에러
  if (postIndex < 0) {
    return {
      success: false,
      error: {
        code: "POST_NOT_FOUND",
        message: "해당 사용자의 게시물을 찾을 수 없습니다.",
      },
    };
  }
  // 공통 상세 조립 로직 재사용
  const detailResult = buildPostDetailBase({ postId, viewerId });
  // base 실패면 그대로 반환
  if (!detailResult.success) return detailResult;

  // profile용 계산값 만들기
  const followerCount = getFollowersByUserId(user.id).length;
  const followingCount = getFollowingsByUserId(user.id).length;
  const isFollowing = isFollowingUser({
    followerId: viewerId,
    followingId: user.id,
  });
  // 이전 글 / 다음 글 계산
  const prevPost = postIndex > 0 ? userPosts[postIndex - 1] : null;
  const nextPost =
    postIndex < userPosts.length - 1 ? userPosts[postIndex + 1] : null;

  return {
    success: true,
    data: {
      profile: toProfileResponse({
        user,
        viewerId,
        postCount: userPosts.length,
        followerCount,
        followingCount,
        isFollowing,
      }),
      post: detailResult.data.post,
      comments: detailResult.data.comments,
      navigation: {
        prevPostId: prevPost?.id ?? null,
        nextPostId: nextPost?.id ?? null,
      },
    },
  };
};

module.exports = {
  getUserFeedDetailData,
};
