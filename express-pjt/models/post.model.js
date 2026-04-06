// models/post.model

const mongoose = require("mongoose");

// 게시물 내부의 media 하나를 표현하는 서브 스키마
const postMediaSchema = new mongoose.Schema(
  {
    url: {
      type: String, // 이미지/영상 주소
      required: true,
    },

    type: {
      type: String,
      enum: ["image", "video"], // image 또는 video만 허용
      default: "image", // 값이 없으면 image
    },

    order: {
      type: Number,
      required: true,
      min: 1, // 1 이상만 허용
    },
  },
  {
    _id: false, // media 배열 안 각 요소에 자동 _id 생성 안 함
  }
);

// Post 문서 구조 정의
const postSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB ObjectId 타입
      ref: "User", // User 컬렉션 참조 의미
      required: true, // 반드시 있어야 함
      index: true, // 이 필드로 조회 자주 하니까 인덱스 생성
    },

    content: {
      type: String, // 게시글 본문
      default: "", // 비어있으면 빈 문자열
      maxlength: 2000, // 최대 길이 제한
    },

    media: {
      type: [postMediaSchema], // media는 postMediaSchema 배열
      default: [], // 기본값은 빈 배열
      validate: {
        // 커스텀 로직
        validator: function (value) {
          return value.length <= 10; // media 최대 10개까지만 허용
        },
        message: "미디어는 최대 10개까지 가능합니다.",
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

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 생성
  }
);

// authorId로 유저 게시글 목록 조회 + 최신순 정렬에 유리
postSchema.index({ authorId: 1, isDeleted: 1, _id: -1 });

module.exports = mongoose.model("Post", postSchema);
