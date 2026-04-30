"use client";

import { useEffect, useRef } from "react";
import { getUnreadCountAction } from "@/app/actions/notifications.action";
import { useAuthStore } from "@/stores/auth.store";
import { useNotificationStore } from "@/stores/notification.store";

// ★ 폴링 주기 — 변경하려면 이 값만 수정
const POLL_INTERVAL_MS = 10_000;

// 사이드바에서 한 번만 마운트해 전역 폴링을 담당하는 훅
export function useUnreadCountPoller() {
  const user = useAuthStore((s) => s.user);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  // clearInterval을 위해 interval ID를 ref로 보관
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCount = async () => {
    const res = await getUnreadCountAction();
    if (!res.isError) setUnreadCount(res.count ?? 0);
  };

  useEffect(() => {
    // 로그아웃 상태면 뱃지 초기화 후 폴링 중단
    if (!user) {
      setUnreadCount(0);
      return;
    }

    // 마운트 시 즉시 1회 조회 후 주기적으로 반복
    fetchCount();
    intervalRef.current = setInterval(fetchCount, POLL_INTERVAL_MS);

    // 언마운트(로그아웃/컴포넌트 제거) 시 인터벌 정리
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user]); // user 변경(로그인/로그아웃) 시 폴링 재시작
}
