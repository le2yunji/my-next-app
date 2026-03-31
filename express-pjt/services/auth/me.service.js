// service/auth/me.service.js
const User = require("../../models/user.model");

async function getMe(mongoId) {
  const user = await User.findOne({
    _id: mongoId,
    isDeleted: false,
  }).select("_id id name email phone profileImageUrl createdAt");

  if (!user) {
    const err = new Error("사용자를 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  return user;
}

module.exports = { getMe };
