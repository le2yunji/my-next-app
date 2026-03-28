const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const normalization = require("../utils/regex");

async function signup({ id, email, phone, password, passwordConfirm }) {
  if (!email && !phone) {
    const err = new Error(
      "이메일 또는 휴대폰 번호 중 하나는 반드시 입력해야 합니다."
    );
    err.status = 400;
    throw err;
  }
  if (password !== passwordConfirm) {
    const err = new Error("비밀번호 확인이 일치하지 않습니다.");
    err.status = 400;
    throw err;
  }

  const normalizedId = id?.normalization(id);
  const normalizedEmail = email?.normalization(email);
  const normalizedPhone = phone?.normalization(phone);

  // 기존 회원 확인
  if (normalizedId) {
    const existingIdUser = await User.findOne({
      id: normalizedId,
    });
    if (existingIdUser) {
      const err = new Error("이미 사용 중인 아이디입니다.");
      err.status = 409; // 409 Conflict
      throw err;
    }
  }

  if (normalizedEmail) {
    const existingEmailUser = await User.findOne({ email: normalizedEmail });
    if (existingEmailUser) {
      const err = new Error("이미 사용 중인 이메일입니다.");
      err.status = 409;
      throw err;
    }
  }

  if (normalizedPhone) {
    const existingPhoneUser = await User.findOne({ phone: normalizedPhone });
    if (existingPhoneUser) {
      const err = new Error("이미 사용 중인 휴대폰 번호입니다.");
      err.status = 409;
      throw err;
    }
  }

  if (password !== passwordConfirm) {
    const err = new Error("비밀번호 확인이 일치하지 않습니다.");
    err.status = 400; // 400 Bad Request
    throw err;
  }

  // 비밀번호 해시화
  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    id: normalizedId,
    email: normalizedEmail,
    phone: normalizedPhone,
    passwordHash,
  });

  const savedUser = await user.save();
  return {
    userId: savedUser._id,
    id: savedUser.id,
    email: savedUser.email,
    phone: savedUser.phone,
    createdAt: savedUser.createdAt,
  };
}

module.exports = { signup };
