import { NotificationType } from "@/entities/notification/model/types";
import { Heart, MessageCircle, UserPlus, Bookmark } from "lucide-react";

// 알림 타입별 아이콘과 배경색 정의 — 아바타 아래 뱃지에 사용
export const NOTIFICATION_ICON: Record<
  NotificationType,
  { Icon: React.ElementType; bg: string }
> = {
  POST_LIKE: { Icon: Heart, bg: "bg-rust" },
  COMMENT_LIKE: { Icon: Heart, bg: "bg-rust" },
  COMMENT_REPLY: { Icon: MessageCircle, bg: "bg-cool-gray" },
  POST_COMMENT: { Icon: MessageCircle, bg: "bg-rust" },
  FOLLOW: { Icon: UserPlus, bg: "bg-sand" },
  BOARD_LIKE: { Icon: Bookmark, bg: "bg-sand" },
  POST_SCRAP: { Icon: Bookmark, bg: "bg-cool-gray" },
};

// 설정 페이지에 표시할 알림 타입 순서
export const PREF_TYPES: NotificationType[] = [
  "COMMENT_LIKE",
  "COMMENT_REPLY",
  "POST_COMMENT",
  "FOLLOW",
  "POST_LIKE",
  "BOARD_LIKE",
  "POST_SCRAP",
];

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
