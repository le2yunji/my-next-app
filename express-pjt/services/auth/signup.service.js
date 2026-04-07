const bcrypt = require("bcrypt");
const User = require("../../models/user.model");

const { AUTH_ERROR } = require("../../constants/auth-error");
const { createAppError } = require("../../utils/app-error");
const {
  isValidId,
  isValidPassword,
  isValidName,
  isValidEmail,
  isValidPhone,
  normalizeText,
  normalizePhone,
} = require("../../utils/regex");

async function signup({
  userId,
  name,
  email,
  phone,
  password,
  passwordConfirm,
}) {
  if (!userId) throw createAppError(AUTH_ERROR.ID_REQUIRED);
  if (!name) throw createAppError(AUTH_ERROR.NAME_REQUIRED);
  if (!email) throw createAppError(AUTH_ERROR.EMAIL_REQUIRED);
  if (!phone) throw createAppError(AUTH_ERROR.PHONE_REQUIRED);
  if (!password) throw createAppError(AUTH_ERROR.PASSWORD_REQUIRED);
  if (!passwordConfirm)
    throw createAppError(AUTH_ERROR.PASSWORD_CONFIRM_REQUIRED);

  if (!isValidId(userId)) throw createAppError(AUTH_ERROR.INVALID_ID);
  if (!isValidName(name)) throw createAppError(AUTH_ERROR.INVALID_NAME);
  if (!isValidEmail(email)) throw createAppError(AUTH_ERROR.INVALID_EMAIL);
  if (!isValidPhone(phone)) throw createAppError(AUTH_ERROR.INVALID_PHONE);
  if (!isValidPassword(password))
    throw createAppError(AUTH_ERROR.INVALID_PASSWORD);

  if (password !== passwordConfirm) {
    throw createAppError(AUTH_ERROR.PASSWORD_CONFIRM_MISMATCH);
  }

  const normalizedId = normalizeText(userId);
  const normalizedName = normalizeText(name);
  const normalizedEmail = normalizeText(email);
  const normalizedPhone = normalizePhone(phone);

  // 기존 회원 확인
  const existingIdUser = await User.findOne({ userId: normalizedId });
  if (existingIdUser) throw createAppError(AUTH_ERROR.DUPLICATE_ID);

  const existingEmailUser = await User.findOne({ email: normalizedEmail });
  if (existingEmailUser) throw createAppError(AUTH_ERROR.DUPLICATE_EMAIL);

  const existingPhoneUser = await User.findOne({ phone: normalizedPhone });
  if (existingPhoneUser) throw createAppError(AUTH_ERROR.DUPLICATE_PHONE);

  // 비밀번호 해시화
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    userId: normalizedId,
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    passwordHash,
  });

  const savedUser = await user.save();
  return {
    mongoId: savedUser._id,
    userId: savedUser.userId,
    name: savedUser.name,
    email: savedUser.email,
    phone: savedUser.phone,
    createdAt: savedUser.createdAt,
  };
}

module.exports = { signup };
