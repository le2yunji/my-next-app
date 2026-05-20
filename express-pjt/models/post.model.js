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
  },
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
          enum: SYSTEM_CATEGORIES, // SYSTEM_CATEGORIES 만 허용
        },
      ],
      default: [],
    },

    customCategories: {
      type: [String],
      default: [],
    },

    likeCount: {
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
  },
);

postSchema.index({ authorId: 1, isDeleted: 1, _id: -1 });
postSchema.index({ primaryCategory: 1, isDeleted: 1, _id: -1 });
postSchema.index({ categories: 1, isDeleted: 1, _id: -1 });
postSchema.index({ saveCount: -1, isDeleted: 1, _id: -1 });
postSchema.index({ likeCount: -1, isDeleted: 1, _id: -1 });

module.exports = mongoose.model("Post", postSchema);
