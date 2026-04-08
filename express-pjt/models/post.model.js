const mongoose = require("mongoose");

const SYSTEM_CATEGORIES = [
  "fashion",
  "beauty",
  "cafe",
  "food",
  "travel",
  "interior",
  "object",
  "desk",
  "art",
  "music",
  "book",
  "film",
  "photo",
  "plant",
  "pet",
];

const postMediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      default: "",
      maxlength: 2000,
      trim: true,
    },

    media: {
      type: [postMediaSchema],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "미디어는 최대 10개까지 가능합니다.",
      },
    },

    primaryCategory: {
      type: String,
      enum: SYSTEM_CATEGORIES,
      default: undefined,
      index: true,
    },

    categories: {
      type: [
        {
          type: String,
          enum: SYSTEM_CATEGORIES,
        },
      ],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 3;
        },
        message: "카테고리는 최대 3개까지 가능합니다.",
      },
    },

    customCategories: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 3;
        },
        message: "직접 입력 카테고리는 최대 3개까지 가능합니다.",
      },
    },

    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    saveCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ authorId: 1, isDeleted: 1, _id: -1 });
postSchema.index({ primaryCategory: 1, isDeleted: 1, _id: -1 });
postSchema.index({ categories: 1, isDeleted: 1, _id: -1 });
postSchema.index({ saveCount: -1, isDeleted: 1, _id: -1 });
postSchema.index({ likeCount: -1, isDeleted: 1, _id: -1 });

module.exports = mongoose.model("Post", postSchema);
