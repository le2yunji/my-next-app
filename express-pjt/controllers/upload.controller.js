const { generatePresignedUrls } = require("../services/upload.service");

// presigned URL 발급만 담당 — 실제 파일은 클라이언트가 S3에 직접 업로드함
async function getPresignedUrls(req, res, next) {
  try {
    const mongoUserId = req.user.mongoId;
    const { context, files } = req.body;

    const result = await generatePresignedUrls({ context, files, mongoUserId });

    if (!result.success) {
      return res.status(400).json({
        isError: true,
        code: result.error.code,
        message: result.error.message,
      });
    }

    return res.status(200).json({
      isError: false,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getPresignedUrls };
