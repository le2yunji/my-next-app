const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },

    coverImage: {
      type: String,
      default: null,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      index: true,
    },

    itemCount: {
      type: Number,
      default: 0,
      min: 0,
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

// 내 보드 목록 조회 / 최신 수정순 정렬
boardSchema.index({ ownerId: 1, isDeleted: 1, updatedAt: -1 });

module.exports = mongoose.model("Board", boardSchema);
