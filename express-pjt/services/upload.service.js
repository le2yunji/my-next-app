const crypto = require("crypto");
const { createPresignedPutUrl } = require("../utils/s3");
const { S3_PUBLIC_BASE_URL } = require("../env");

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// MIME 타입 → 확장자 변환 (S3 Key에 올바른 확장자를 붙이기 위함)
const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// context별로 허용 파일 수와 최대 크기를 분리 관리
const CONTEXT_CONFIG = {
  post: { maxFiles: 10, maxSizeBytes: 10 * 1024 * 1024 }, // 게시글: 최대 10개, 10MB
  profile: { maxFiles: 1, maxSizeBytes: 5 * 1024 * 1024 }, // 프로필: 최대 1개, 5MB
};

// S3 Key 구조: posts/{userId}/{timestamp}-{uuid}.jpg
// timestamp로 정렬 가능하고, uuid로 중복 방지
const buildKey = (context, mongoUserId, mimeType) => {
  const ext = MIME_TO_EXT[mimeType];
  const timestamp = Date.now();
  const uuid = crypto.randomUUID();
  return `${context}s/${mongoUserId}/${timestamp}-${uuid}.${ext}`;
};

/**
 * presigned URL 일괄 생성
 *
 * 반환값:
 * - presignedUrl: 클라이언트가 S3에 직접 PUT할 때 사용하는 임시 URL (10분 유효)
 * - key: S3 내 객체 경로. 게시글/프로필 생성 시 payload에 포함해서 서버로 전달
 * - publicUrl: 업로드 완료 후 DB에 저장할 이미지 접근 URL
 */
const generatePresignedUrls = async ({ context, files, mongoUserId }) => {
  const config = CONTEXT_CONFIG[context];
  if (!config) {
    return {
      success: false,
      error: {
        code: "INVALID_UPLOAD_CONTEXT",
        message: "유효하지 않은 업로드 컨텍스트입니다.",
      },
    };
  }

  if (!Array.isArray(files) || files.length === 0) {
    return {
      success: false,
      error: { code: "NO_FILES", message: "파일 정보가 없습니다." },
    };
  }

  if (files.length > config.maxFiles) {
    return {
      success: false,
      error: {
        code: "TOO_MANY_FILES",
        message: `파일은 최대 ${config.maxFiles}개까지 업로드할 수 있습니다.`,
      },
    };
  }

  // 실제 파일 데이터 없이 mimeType과 size만 받으므로 서버에서 직접 검증
  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) {
      return {
        success: false,
        error: {
          code: "INVALID_MIME_TYPE",
          message:
            "지원하지 않는 파일 형식입니다. (jpeg, png, webp, gif만 허용)",
        },
      };
    }
    if (typeof file.size !== "number" || file.size <= 0) {
      return {
        success: false,
        error: {
          code: "INVALID_FILE_SIZE",
          message: "파일 크기 정보가 올바르지 않습니다.",
        },
      };
    }
    if (file.size > config.maxSizeBytes) {
      const limitMB = config.maxSizeBytes / 1024 / 1024;
      return {
        success: false,
        error: {
          code: "FILE_TOO_LARGE",
          message: `파일 크기는 최대 ${limitMB}MB까지 허용됩니다.`,
        },
      };
    }
  }

  // 파일마다 고유한 key를 생성하고 presigned URL을 병렬로 발급
  const results = await Promise.all(
    files.map(async ({ mimeType }) => {
      const key = buildKey(context, mongoUserId, mimeType);
      const presignedUrl = await createPresignedPutUrl({ key, mimeType });
      const publicUrl = `${S3_PUBLIC_BASE_URL}/${key}`;
      return { presignedUrl, key, publicUrl };
    }),
  );

  return { success: true, data: results };
};

module.exports = { generatePresignedUrls };
