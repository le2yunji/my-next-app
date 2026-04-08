const mongoose = require("mongoose");

const boardItemSchema = new mongoose.Schema(
  {
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    // 게시물 전체를 저장하되, 보드에서 대표로 보여줄 이미지 순번
    // Post.media[].order 값과 맞춰서 사용
    savedMediaOrder: {
      type: Number,
      default: null,
      min: 1,
    },

    // 보드 목록/커버에서 빠르게 쓰기 위한 스냅샷 이미지
    thumbnailUrl: {
      type: String,
      default: null,
    },

    // 저장 메모
    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 같은 보드에는 같은 게시물 1번만 저장 가능
boardItemSchema.index(
  { boardId: 1, postId: 1, isDeleted: 1 },
  { unique: true }
);

// 특정 보드의 저장 목록 조회
boardItemSchema.index({ boardId: 1, isDeleted: 1, createdAt: -1 });

// 내가 저장한 전체 항목 조회
boardItemSchema.index({ ownerId: 1, isDeleted: 1, createdAt: -1 });

// 게시물 기준으로 어디에 저장됐는지 집계하거나 확인할 때 사용 가능
boardItemSchema.index({ postId: 1, isDeleted: 1 });

module.exports = mongoose.model("BoardItem", boardItemSchema);
