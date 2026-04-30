// 백엔드 Notification 모델의 type 필드와 1:1 대응
export type NotificationType =
  | "COMMENT_LIKE"
  | "COMMENT_REPLY"
  | "POST_COMMENT"
  | "FOLLOW"
  | "POST_LIKE"
  | "BOARD_LIKE"
  | "POST_SCRAP";

// 알림이 가리키는 대상 리소스 종류
export type NotificationTargetType = "POST" | "COMMENT" | "BOARD" | "USER";

export type NotificationSender = {
  id: string;
  userId: string;
  name: string;
  profileImage: string | null;
};

export type NotificationTarget = {
  id: string;
  type: NotificationTargetType;
};

// 알림 목록 API 응답의 개별 아이템 형태
export type NotificationItem = {
  id: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  sender: NotificationSender | null; // 탈퇴 유저면 null
  target: NotificationTarget | null; // 삭제된 대상이면 null
};

// 알림 아이템 본문에 표시되는 문구 — sender 이름 뒤에 이어 붙임
export const NOTIFICATION_TEXT: Record<NotificationType, string> = {
  COMMENT_LIKE: "님이 회원님의 댓글을 좋아합니다.",
  COMMENT_REPLY: "님이 회원님의 댓글에 답글을 달았습니다.",
  POST_COMMENT: "님이 회원님의 게시물에 댓글을 남겼습니다.",
  FOLLOW: "님이 회원님을 팔로우하기 시작했습니다.",
  POST_LIKE: "님이 회원님의 게시물을 좋아합니다.",
  BOARD_LIKE: "님이 회원님의 보드를 좋아합니다.",
  POST_SCRAP: "님이 회원님의 게시물을 저장했습니다.",
};

// 설정 페이지의 토글 레이블 — NOTIFICATION_TEXT 보다 짧은 표현
export const NOTIFICATION_LABEL: Record<NotificationType, string> = {
  COMMENT_LIKE: "댓글 좋아요",
  COMMENT_REPLY: "대댓글",
  POST_COMMENT: "게시물 댓글",
  FOLLOW: "팔로우",
  POST_LIKE: "게시물 좋아요",
  BOARD_LIKE: "보드 좋아요",
  POST_SCRAP: "게시물 저장",
};
