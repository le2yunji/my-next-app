import { create } from "zustand";

// 사이드바 알림 뱃지에 표시할 미읽음 카운트를 전역으로 관리
type NotificationState = {
  unreadCount: number;
  // 폴링으로 서버 값을 받아와 덮어쓸 때 사용
  setUnreadCount: (count: number) => void;
  // 낙관적으로 1 감소 (읽음 처리 시 즉시 반영, 최솟값 0 보장)
  decrementUnread: () => void;
  // 알림 페이지 진입 시 뱃지를 0으로 초기화
  resetUnread: () => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  decrementUnread: () =>
    set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
  resetUnread: () => set({ unreadCount: 0 }),
}));
