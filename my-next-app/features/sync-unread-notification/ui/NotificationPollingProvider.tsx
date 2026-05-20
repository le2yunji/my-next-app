"use client";
import { useUnreadCountPoller } from "@/features/sync-unread-notification/model/useUnreadCountPoller";

export function NotificationPollingProvider() {
  useUnreadCountPoller();
  return null;
}
