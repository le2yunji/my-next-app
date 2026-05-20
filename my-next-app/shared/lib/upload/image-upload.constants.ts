export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const IMAGE_ACCEPT = ALLOWED_IMAGE_MIME_TYPES.join(",");

export const DEFAULT_IMAGE_MAX_SIZE_BYTES = 10 * 1024 * 1024; // 약 10 MB

export const UPLOAD_CONTEXT_CONFIG = {
  post: {
    maxFiles: 10,
    maxSizeBytes: 10 * 1024 * 1024, // 약 10MB
  },
  profile: {
    maxFiles: 1,
    maxSizeBytes: 10 * 1024 * 1024, // 약 10MB
  },
} as const;

export type UploadContext = keyof typeof UPLOAD_CONTEXT_CONFIG;
