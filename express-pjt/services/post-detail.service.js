// services/user-feed-detail.service.js
const {
  getUserById,
  getPostsByUserId,
} = require("../selectors/user.selectors");
const { toUserProfileSummaryResponse } = require("../mappers/user.mapper");
const { buildPostDetailBase } = require("./post-detail-base.service");

// 게시물 목록을 최신 순으로 정렬
const sortByCreatedAtDesc = (items) => {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// 유저 프로필 안에서 게시물 상세를 볼 때 필요한 데이터 생성
const getUserPostDetailPageData = ({ userId, postId, viewerId = null }) => {
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
  const userPosts = sortByCreatedAtDesc(getPostsByUserId(userId) ?? []);
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

  // 이전 글 / 다음 글 계산
  const prevPost = postIndex > 0 ? userPosts[postIndex - 1] : null;
  const nextPost =
    postIndex < userPosts.length - 1 ? userPosts[postIndex + 1] : null;

  // 댓글 미리보기
  const previewComment = detailResult.data.comments?.[0] ?? null;
  // comment 작성자 id 필드명이 userId인지 authorId인지 데이터 구조에 맞게 확인 필요
  const previewCommentAuthor = previewComment
    ? getUserById(previewComment.userId ?? previewComment.authorId)
    : null;

  return {
    success: true,
    data: {
      profile: toUserProfileSummaryResponse({
        user,
      }),
      post: detailResult.data.post,
      author: detailResult.data.author,
      mediaList: detailResult.data.mediaList,
      likedByMe: detailResult.data.likedByMe,
      previewComment,
      previewCommentAuthor,
      navigation: {
        prevPostId: prevPost?.id ?? null,
        nextPostId: nextPost?.id ?? null,
      },
    },
  };
};

module.exports = {
  getUserPostDetailPageData,
};
