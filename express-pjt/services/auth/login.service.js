// services/auth.service.js
const bcrypt = require("bcrypt");
const User = require("../../models/user.model");
const { normalizeText, normalizePhone } = require("../../utils/regex");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../token.service");

async function login({ identifier, password }) {
  const normalizedIdentifier = normalizeText(identifier);
  const normalizedPhone = normalizePhone(identifier);

  const user = await User.findOne({
    // 사용자가 입력한 값 하나를 세 필드 중 어디에 해당하는지 찾기
    $or: [
      { id: normalizedIdentifier },
      { email: normalizedIdentifier },
      { phone: normalizedPhone },
    ],
    isDeleted: false,
  });

  if (!user) {
    const err = new Error("존재하지 않는 계정입니다.");
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!identifier) {
    const err = new Error("아이디, 이메일 또는 휴대폰 번호를 입력해 주세요.");
    err.status = 400;
    throw err;
  }

  if (!password) {
    const err = new Error("비밀번호를 입력해 주세요.");
    err.status = 400;
    throw err;
  }
  if (!isMatch) {
    const err = new Error("비밀번호가 올바르지 않습니다.");
    err.status = 401;
    throw err;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      id: user.id,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  };
}

module.exports = { login };
