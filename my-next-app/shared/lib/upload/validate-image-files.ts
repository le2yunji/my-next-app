import {
  ALLOWED_IMAGE_MIME_TYPES,
  UPLOAD_CONTEXT_CONFIG,
  type UploadContext,
} from "./image-upload.constants";

type ValidateImageFilesParams = {
  context: UploadContext; // "post" | "profile"
  files: File[];
};

// 이미지 검증 함수
export function validateImageFiles({
  context,
  files,
}: ValidateImageFilesParams): string | null {
  const config = UPLOAD_CONTEXT_CONFIG[context];

  if (files.length === 0) {
    return "파일을 선택해주세요.";
  }

  if (files.length > config.maxFiles) {
    return `최대 ${config.maxFiles}개까지 선택할 수 있습니다.`;
  }

  for (const file of files) {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as never)) {
      return "지원하지 않는 파일 형식입니다. (jpeg, png, webp, gif만 허용)";
    }

    if (file.size <= 0) {
      return "파일 크기 정보가 올바르지 않습니다.";
    }

    if (file.size > config.maxSizeBytes) {
      const limitMB = config.maxSizeBytes / 1024 / 1024;
      return `파일 크기는 최대 ${limitMB}MB까지 허용됩니다.`;
    }
  }

  return null;
}
