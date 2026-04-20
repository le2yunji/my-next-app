const bcrypt = require("bcrypt");
const User = require("../../models/user.model");

const { AUTH_ERROR } = require("../../constants/auth-error");
const { createAppError } = require("../../utils/app-error");
const {
  normalizeText,
  normalizePhone,
  isValidCustomCategory,
} = require("../../utils/regex");
const { INTEREST_CATEGORIES } = require("../../constants/interest-categories");

async function signup({
  userId,
  name,
  email,
  phone,
  password,
  interestCategories,
  customInterestCategories,
}) {
  if (interestCategories) {
    if (
      !Array.isArray(interestCategories) ||
      !interestCategories.every((c) => INTEREST_CATEGORIES.includes(c))
    )
      throw createAppError(AUTH_ERROR.INVALID_INTEREST_CATEGORY);
  }
  if (customInterestCategories) {
    if (
      !Array.isArray(customInterestCategories) ||
      !customInterestCategories.every((c) => isValidCustomCategory(c))
    )
      throw createAppError(AUTH_ERROR.INVALID_CUSTOM_CATEGORY);
  }
  const totalCategories =
    (interestCategories?.length ?? 0) + (customInterestCategories?.length ?? 0);
  if (totalCategories > 10)
    throw createAppError(AUTH_ERROR.INTEREST_CATEGORY_LIMIT);

  const normalizedId = normalizeText(userId);
  const normalizedName = name.trim();
  const normalizedEmail = normalizeText(email);
  const normalizedPhone = normalizePhone(phone);

  // 기존 회원 확인 (탈퇴 회원 제외)
  const existingUser = await User.findOne({
    isDeleted: false,
    $or: [
      { userId: normalizedId },
      { email: normalizedEmail },
      { phone: normalizedPhone },
    ],
  }).select("userId email phone");

  if (existingUser) {
    if (existingUser.userId === normalizedId)
      throw createAppError(AUTH_ERROR.DUPLICATE_ID);
    if (existingUser.email === normalizedEmail)
      throw createAppError(AUTH_ERROR.DUPLICATE_EMAIL);
    throw createAppError(AUTH_ERROR.DUPLICATE_PHONE);
  }

  // 비밀번호 해시화
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    userId: normalizedId,
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    passwordHash,
    interestCategories,
    customInterestCategories,
  });

  const savedUser = await user.save();
  return {
    mongoId: savedUser._id,
    userId: savedUser.userId,
    name: savedUser.name,
    email: savedUser.email,
    phone: savedUser.phone,
    interestCategories: savedUser.interestCategories,
    customInterestCategories: savedUser.customInterestCategories,
    createdAt: savedUser.createdAt,
  };
}

module.exports = { signup };
