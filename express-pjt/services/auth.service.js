const userRepo = require("../repositories/user.repository");

function signup({ id, password }) {
  if (userRepo.existsById(id)) {
    const err = new Error("id already exists");
    err.status = 409;
    throw err;
  }

  userRepo.createUser(id, { password });

  return {
    id,
    message: "회원가입에 성공했습니다!",
  };
}

function login({ id, password }) {
  const user = userRepo.findById(id);

  if (!user || user.password !== password) {
    const err = new Error("invalid credentials");
    err.status = 401;
    throw err;
  }

  return {
    message: "로그인에 성공했습니다!",
  };
}

module.exports = { signup, login };
