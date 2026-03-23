const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";

const DEFAULT_PROFILE_IMAGE_PATH = "/static/images/profiles/default.webp";

// 상대 경로 -> 절대 URL
const toAbsoluteUrl = (path) => {
  if (!path || typeof path !== "string") return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const base = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${base}${normalizedPath}`;
};

// 프로필 이미지 상대 경로 생성
const buildProfileImagePath = (imageNo) => {
  if (!imageNo) return null;
  return `/static/images/profiles/${imageNo}.webp`;
};

// 피드 이미지 상대 경로 생성
const buildFeedImagePath = (imageNo) => {
  if (!imageNo) return null;
  return `/static/images/feed/${imageNo}.webp`;
};

// 프로필 이미지 최종 URL 반환 (없으면 기본 이미지)
const resolveProfileImageUrl = (profileImagePath) => {
  return toAbsoluteUrl(profileImagePath || DEFAULT_PROFILE_IMAGE_PATH);
};

// 피드 이미지 최종 URL 반환
const resolveFeedImageUrl = (feedImagePath) => {
  return toAbsoluteUrl(feedImagePath);
};

module.exports = {
  API_BASE_URL,
  DEFAULT_PROFILE_IMAGE_PATH,
  toAbsoluteUrl,
  buildProfileImagePath,
  buildFeedImagePath,
  resolveProfileImageUrl,
  resolveFeedImageUrl,
};
