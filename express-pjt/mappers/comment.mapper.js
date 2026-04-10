const { toUserResponse } = require("./user.mapper");

const toCommentResponse = ({ comment, author }) => {
  return {
    id: String(comment._id ?? comment.id ?? ""),
    author: author ? toUserResponse(author) : null,
    content: comment.isDeleted ? "삭제된 댓글입니다." : comment.content,
    parentCommentId: comment.parentCommentId
      ? String(comment.parentCommentId)
      : null,
    depth: comment.depth ?? 0,
    replyCount: comment.replyCount ?? 0,
    isDeleted: comment.isDeleted ?? false,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

const toCommentThreadResponse = ({ comment, author, replies = [] }) => {
  return {
    comment: toCommentResponse({ comment, author }),
    replies: replies.map((reply) =>
      toCommentResponse({
        comment: reply.comment,
        author: reply.author,
      })
    ),
  };
};

module.exports = {
  toCommentResponse,
  toCommentThreadResponse,
};
