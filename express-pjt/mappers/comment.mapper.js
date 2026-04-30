const { toUserResponse } = require("./user.mapper");

const toCommentResponse = ({ comment, author, isLiked = false }) => {
  return {
    id: String(comment._id ?? comment.id ?? ""),
    author: author ? toUserResponse(author) : null,
    content: comment.isDeleted ? "삭제된 댓글입니다." : comment.content,
    parentCommentId: comment.parentCommentId
      ? String(comment.parentCommentId)
      : null,
    depth: comment.depth ?? 0,
    replyCount: comment.replyCount ?? 0,
    likeCount: comment.likeCount ?? 0,
    isLiked,
    isDeleted: comment.isDeleted ?? false,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

// likedCommentIdSet: 현재 뷰어가 좋아요한 commentId Set (비로그인 시 빈 Set)
const toCommentThreadResponse = (
  { comment, author, replies = [] },
  likedCommentIdSet = new Set(),
) => {
  const commentId = String(comment._id ?? comment.id ?? "");
  return {
    comment: toCommentResponse({
      comment,
      author,
      isLiked: likedCommentIdSet.has(commentId),
    }),
    replies: replies.map((reply) => {
      const replyId = String(reply.comment._id ?? reply.comment.id ?? "");
      return toCommentResponse({
        comment: reply.comment,
        author: reply.author,
        isLiked: likedCommentIdSet.has(replyId),
      });
    }),
  };
};

module.exports = {
  toCommentResponse,
  toCommentThreadResponse,
};
