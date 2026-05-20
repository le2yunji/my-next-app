// controllers/upload.controllers
const { generatePresignedUrls } = require("../services/upload.service");

// presigned URL 발급만 담당 — 실제 파일은 클라이언트가 S3에 직접 업로드함
async function getPresignedUrls(req, res, next) {
  try {
    // 1. 인증 미들웨어에서 넣어준 사용자 ID 꺼냄
    const mongoUserId = req.user.mongoId;
    if (!req.user?.mongoId) {
      return res.status(401).json({
        isError: true,
        code: "UNAUTHORIZED",
        message: "인증이 필요합니다.",
      });
    }

    // 2. 클라이언트가 보낸 업로드 목적과 파일 정보 꺼냄
    const { context, files } = req.body;
    // 3. 서비스에 presigned URL 생성을 요청
    const result = await generatePresignedUrls({ context, files, mongoUserId });

    // 4. 검증 실패 또는 URL 생성 실패 시 400 반환
    if (!result.success) {
      return res.status(400).json({
        isError: true,
        code: result.error.code,
        message: result.error.message,
      });
    }
    // 5. 성공 시 presigned URL 목록 반환
    return res.status(200).json({
      isError: false,
      data: result.data,
    });
  } catch (error) {
    // 6. 예상 못한 서버 에러는 공통 에러 핸들러로 전달
    next(error);
  }
}

module.exports = { getPresignedUrls };
