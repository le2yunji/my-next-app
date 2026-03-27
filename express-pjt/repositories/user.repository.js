const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data/users.json");

/**
 * 내부 유틸
 */
function readUsers() {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }

  const raw = fs.readFileSync(DATA_PATH, "utf-8").trim();

  if (!raw) {
    return [];
  }

  return JSON.parse(raw); // JSON → JS 배열
}

function writeUsers(users) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2), "utf-8");
}

/**
 * Repository API
 */

// 내부 고유 id로 유저 찾기
function findByUserId(id) {
  const users = readUsers();
  return users.find((user) => user.id === id) || null;
}

// 로그인용 아이디(loginId)로 유저 찾기
function findByLoginId(loginId) {
  const users = readUsers();
  return users.find((user) => user.loginId === loginId) || null;
}

// loginId 중복 검사
function existsByLoginId(loginId) {
  const users = readUsers();
  return users.some((user) => user.loginId === loginId);
}

// 새 유저 추가
function createUser(userData) {
  const users = readUsers();

  users.push(userData);
  writeUsers(users);

  return userData;
}

module.exports = {
  findByUserId,
  findByLoginId,
  existsByLoginId,
  createUser,
};
