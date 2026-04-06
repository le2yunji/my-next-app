// models/user.model
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true, // 값이 없으면 저장 실패
      unique: true, // 중복 불가
      trim: true, // 앞뒤 공백 제거
      minlength: 4, // 4자 미만 시 validation 에러
      maxlength: 10, // 10자 초과 시 validation 에러
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // 대문자를 소문자로 변환해서 저장
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 10, // 10자 초과 시 validation 에러
      default: "",
    },
    birth: {
      type: Date,
    },
    bio: {
      type: String,
      default: "", // 값이 없으면 빈 문자열 저장
      maxlength: 160, // 160자 초과 불가
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // 값이 있는 문서들끼리만 unique 검사, 값이 없는 문서는 허용
    },
    profileImage: {
      type: String, // 프로필 이미지 URL 문자열
      default: "static/images/profiles/default.webp", // 없으면 기본 이미지 경로
    },
    followerCount: {
      type: Number, // 숫자 타입
      default: 0, // 기본값 0
      min: 0, // 0 미만이면 에러
    },
    followingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    postCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isDeleted: {
      type: Boolean, // true / false 타입
      default: false, // 기본은 삭제되지 않은 상태
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
