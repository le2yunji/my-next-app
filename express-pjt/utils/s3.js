const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
} = require("../env");

// S3Client는 앱 전체에서 하나만 생성해서 재사용 (연결 비용 절감)
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  // SDK v3 기본값인 CRC32 자동 체크섬을 끔
  // 활성화하면 presigned URL에 x-amz-checksum-crc32 헤더가 포함되어 브라우저 CORS preflight가 실패함
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

/**
 * S3 PUT용 presigned URL 생성
 *
 * - 서버가 URL을 발급하면 클라이언트가 이 URL로 직접 S3에 PUT 요청을 보냄
 * - Express 서버를 거치지 않아 서버 메모리/대역폭 부담 없음
 * - expiresIn(기본 600초) 이후엔 URL이 만료되어 업로드 불가
 * - ContentType을 커맨드에 포함하면 해당 MIME 타입으로만 업로드 가능하도록 제한됨
 */
const createPresignedPutUrl = ({ key, mimeType, expiresIn = 600 }) => {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    ContentType: mimeType,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
};

module.exports = { createPresignedPutUrl };
