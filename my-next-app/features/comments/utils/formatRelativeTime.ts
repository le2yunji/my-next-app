/**
 * 주어진 ISO 날짜 문자열을 "N분 전", "N시간 전", "N일 전" 형식으로 반환
 */
export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return "방금 전";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}일 전`;
  return new Date(isoString).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
}
