// services/auth.service.js
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const normalization = require("../utils/regex");

async function login({ identifier, password }) {
  const normalizedIdentifier = normalization(identifier);

  const user = await User.findOne({
    // 사용자가 입력한 값 하나를 세 필드 중 어디에 해당하는지 찾기
    $or: [
      { loginId: normalizedIdentifier },
      { email: normalizedIdentifier },
      { phone: identifier.trim() },
    ],
    isDeleted: false,
  });

  if (!user) {
    const err = new Error("존재하지 않는 계정입니다.");
    err.status = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, existingUser.passwordHash);

  if (!isMatch) {
    const err = new Error("비밀번호가 올바르지 않습니다.");
    err.status = 401;
    throw err;
  }

  return {
    message: "로그인에 성공했습니다!",
    user: {
      id: user._id,
      loginId: user.loginId,
      email: user.email,
      phone: user.phone,
    },
  };
}

module.exports = { login };
