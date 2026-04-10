// 보드 목록 커서를 문자열로 인코딩
// 정렬 기준이 updatedAt DESC, _id DESC 이므로
// 다음 페이지 조회를 위해 updatedAt과 _id를 함께 저장한다.
function encodeBoardCursor(board) {
  const payload = {
    updatedAt: new Date(board.updatedAt).toISOString(),
    id: String(board._id),
  };

  // 클라이언트에는 사용하기 쉬운 문자열 형태로 전달
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

// 클라이언트가 보낸 cursor 문자열을 다시 서버 내부용 객체로 복원
function decodeBoardCursor(cursor) {
  // base64 문자열을 원래 JSON 문자열로 복원
  const decoded = Buffer.from(cursor, "base64").toString("utf8");

  // JSON 파싱해서 updatedAt, id 추출
  const parsed = JSON.parse(decoded);

  // 필요한 값이 없으면 잘못된 커서로 판단
  if (!parsed.updatedAt || !parsed.id) {
    throw new Error("INVALID_CURSOR");
  }

  return {
    // 쿼리에서 날짜 비교를 해야 하므로 Date 객체로 다시 변환
    updatedAt: new Date(parsed.updatedAt),

    // _id 비교용 문자열
    id: parsed.id,
  };
}

module.exports = {
  encodeBoardCursor,
  decodeBoardCursor,
};
