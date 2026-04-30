import { Heart, MessageCircle, UserPlus, Bookmark } from "lucide-react";
import type { NotificationType } from "@/features/notifications/types/notification.type";

// 알림 타입별 아이콘과 배경색 정의 — 아바타 아래 뱃지에 사용
export const TYPE_ICON: Record<
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
