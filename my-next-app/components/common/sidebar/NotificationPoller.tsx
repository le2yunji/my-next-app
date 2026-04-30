"use client";

import { useUnreadCountPoller } from "@/features/notifications/hooks/useUnreadCount";

// UI 없이 미읽음 카운트를 전역 스토어에 폴링해서 채우는 컴포넌트
export default function NotificationPoller() {
  useUnreadCountPoller();
  return null;
}
