// mappers/post-detail.mapper.js
const { toAuthorResponse } = require("./user.mapper");
const { toAbsoluteUrl } = require("../constants/image-paths");

// 게시물 상세의 media 항목 하나를 프론트 응답용 형태로 변환
const toPostMediaResponse = (media) => {
  return {
    id: media.id,
    type: media.type,
    url: toAbsoluteUrl(
      media.url ?? media.displayUrl ?? media.fullUrl ?? media.thumbnailUrl
    ),
    thumbnailUrl: toAbsoluteUrl(media.thumbnailUrl ?? media.url),
    displayUrl: toAbsoluteUrl(media.displayUrl ?? media.url),
    fullUrl: toAbsoluteUrl(media.fullUrl ?? media.displayUrl ?? media.url),
    width: media.width,
    height: media.height,
    order: media.order ?? 0,
  };
};

// 댓글 응답 모양 생성
const toCommentResponse = ({ comment, author }) => {
  return {
    id: comment.id,
    author: author ? toAuthorResponse(author) : null,
    content: comment.content,
    createdAt: comment.createdAt,
  };
};

// 게시물 상세 1개 응답 모양 생성
const toSinglePostDetailResponse = ({
  post,
  author,
  mediaList = [],
  likedByMe,
}) => {
  const sortedMedia = [...mediaList].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return {
    id: post.id,
    author: toAuthorResponse(author),
    content: post.content,
    media: sortedMedia.map(toPostMediaResponse),
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    likedByMe,
    createdAt: post.createdAt,
  };
};

// 유저 게시물 상세 페이지 전체 응답 모양 생성
const toUserPostDetailPageResponse = ({
  profile,
  post,
  author,
  mediaList,
  likedByMe,
  previewComment,
  previewCommentAuthor,
  navigation,
}) => {
  return {
    profile,
    post: toSinglePostDetailResponse({
      post,
      author,
      mediaList,
      likedByMe,
    }),
    previewComment: previewComment
      ? toCommentResponse({
          comment: previewComment,
          author: previewCommentAuthor,
        })
      : null,
    navigation,
  };
};

module.exports = {
  toPostMediaResponse,
  toSinglePostDetailResponse,
  toUserPostDetailPageResponse,
  toCommentResponse,
};
