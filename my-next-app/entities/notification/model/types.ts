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
export type NotificationItemType = {
  id: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  sender: NotificationSender | null; // 탈퇴 유저면 null
  target: NotificationTarget | null; // 삭제된 대상이면 null
};
