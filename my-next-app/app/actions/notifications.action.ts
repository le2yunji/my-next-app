"use server";

import apiClient from "@/shared/api/api-client";
import { getServerAuthHeaders } from "@/shared/lib/server/auth-headers";

// 알림 목록 조회 (커서 기반 페이지네이션)
// cursor: 마지막으로 받은 알림의 ID, 없으면 첫 페이지
export const getNotificationsAction = async (
  params: {
    cursor?: string | null;
    limit?: number;
  } = {},
) => {
  const qs = new URLSearchParams();
  if (params.cursor) qs.set("cursor", params.cursor);
  if (params.limit) qs.set("limit", String(params.limit));

  let res: Response;
  try {
    const headers = await getServerAuthHeaders();
    res = await apiClient.get(`/api/notifications?${qs.toString()}`, {
      cache: "no-store",
      headers,
    });
  } catch {
    return { isError: true, message: "네트워크 오류가 발생했습니다." };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }

  if (!res.ok)
    return {
      isError: true,
      message: data?.message ?? "알림 목록을 불러오지 못했습니다.",
    };
  return data;
};

// 미읽음 알림 수 조회 — 사이드바 뱃지 폴링에서 사용
export const getUnreadCountAction = async () => {
  let res: Response;
  try {
    const headers = await getServerAuthHeaders();
    res = await apiClient.get("/api/notifications/unread-count", {
      cache: "no-store",
      headers,
    });
  } catch {
    return { isError: true, count: 0 };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return { isError: true, count: 0 };
  }

  if (!res.ok) return { isError: true, count: 0 };
  return data;
};

// 특정 알림 1개 읽음 처리 — 알림 아이템 클릭 시 호출
export const markNotificationReadAction = async (notificationId: string) => {
  try {
    const headers = await getServerAuthHeaders();
    await apiClient.patch(
      `/api/notifications/${notificationId}/read`,
      undefined,
      {
        headers,
      },
    );
  } catch {
    /* 읽음 처리 실패는 조용히 무시 */
  }
};

// 모든 알림 읽음 처리 — "모두 읽음" 버튼 클릭 시 호출
export const markAllNotificationsReadAction = async () => {
  try {
    const headers = await getServerAuthHeaders();
    await apiClient.patch("/api/notifications/read-all", undefined, {
      headers,
    });
  } catch {
    /* 조용히 무시 */
  }
};

// 알림 수신 설정 조회 — 설정 페이지 마운트 시 호출
export const getNotificationPreferencesAction = async () => {
  let res: Response;
  try {
    const headers = await getServerAuthHeaders();
    res = await apiClient.get("/api/users/me/notification-preferences", {
      cache: "no-store",
      headers,
    });
  } catch {
    return { isError: true, message: "네트워크 오류가 발생했습니다." };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }

  if (!res.ok)
    return {
      isError: true,
      message: data?.message ?? "설정을 불러오지 못했습니다.",
    };
  return data;
};

// 알림 수신 설정 업데이트 — 토글 변경 시 호출
// preferences: { POST_LIKE: true, FOLLOW: false, ... } 형태로 변경할 타입만 전달
export const updateNotificationPreferencesAction = async (
  preferences: Partial<Record<string, boolean>>,
) => {
  try {
    const headers = await getServerAuthHeaders();
    await apiClient.patch(
      "/api/users/me/notification-preferences",
      preferences,
      { headers },
    );
  } catch {
    /* 조용히 무시 */
  }
};
