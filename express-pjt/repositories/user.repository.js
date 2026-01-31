const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data/users.json");

/**
 * 내부 유틸
 */
function readUsers() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8"); // 파일 읽기 (동기 방식-파일 읽을 때까지 코드 멈춤)
  return JSON.parse(raw); // JSON → JS 객체 변환
}

// JS객체 -> 파일 (메모리 객체를 JSON 파일로 다시 저장)
function writeUsers(users) {
  // null → 변환 로직 커스터마이징 안 함
  // 2 → 들여쓰기 2칸 (가독성)
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
}

/**
 * Repository API
 */
// JSON 파일 읽기 -> { id: userData } 객체 획득 -> 해당 id 키로 접근
function findById(id) {
  const users = readUsers();
  return users[id] || null;
}

// 중복 검사
function existsById(id) {
  const users = readUsers();
  return Boolean(users[id]);
}

// 기존 데이터에 새 유저를 추가하고 저장
function createUser(id, userData) {
  const users = readUsers();

  users[id] = userData;
  writeUsers(users);

  return { id, ...userData };
}

module.exports = {
  findById,
  existsById,
  createUser,
};
