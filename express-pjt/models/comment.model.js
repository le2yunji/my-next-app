// models/comment.model.js

const mongoose = require("mongoose");

const MAX_COMMENT_DEPTH = 1;
const MAX_LENGTH = 500;

// 댓글 문서 구조 정의
const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId, // 어떤 게시글의 댓글인지
      ref: "Post", // Post 참조 의미
      required: true, // 반드시 있어야 함
      index: true, // 게시글별 댓글 조회 자주 하므로 인덱스
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId, // 댓글 작성자 id
      ref: "User", // User 참조 의미
      required: true, // 반드시 있어야 함
      index: true, // 작성자 기준 조회 가능성 있어 인덱스
    },

    content: {
      type: String, // 댓글 내용
      required: true, // 반드시 있어야 함
      trim: true, // 앞뒤 공백 제거
      maxlength: MAX_LENGTH, // 최대 500자
    },

    // 바로 위 부모 댓글
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId, // 대댓글용 부모 댓글 id
      ref: "Comment", // Comment 자기 자신 참조
      default: null, // 일반 댓글이면 null
    },

    // 맨 위 원댓글 -> 1단계로만 허용할거면 없어도 됨
    // rootCommentId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Comment",
    //   default: null,
    //   index: true,
    // },

    // 대댓 깊이
    depth: {
      type: Number,
      default: 0,
      min: 0,
      max: MAX_COMMENT_DEPTH, // MVP면 1단계 대댓글까지만 추천
    },

    replyCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

// 특정 게시글의 댓글을 생성순으로 불러올 때 유리
commentSchema.index({ postId: 1, createdAt: 1 });
commentSchema.index({ postId: 1, parentCommentId: 1, createdAt: 1 });

module.exports = mongoose.model("Comment", commentSchema);
