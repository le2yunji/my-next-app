"use server";

import { cookies } from "next/headers";
import apiClient from "@/app/utils/api-client";

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

export const getNotificationsAction = async (params: {
  cursor?: string | null;
  limit?: number;
} = {}) => {
  const qs = new URLSearchParams();
  if (params.cursor) qs.set("cursor", params.cursor);
  if (params.limit) qs.set("limit", String(params.limit));

  let res: Response;
  try {
    const cookieHeader = await getCookieHeader();
    res = await apiClient.get(`/api/notifications?${qs.toString()}`, {
      cache: "no-store",
      headers: { Cookie: cookieHeader },
    });
  } catch {
    return { isError: true, message: "네트워크 오류가 발생했습니다." };
  }

  let data;
  try { data = await res.json(); } catch {
    return { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }

  if (!res.ok) return { isError: true, message: data?.message ?? "알림 목록을 불러오지 못했습니다." };
  return data;
};

export const getUnreadCountAction = async () => {
  let res: Response;
  try {
    const cookieHeader = await getCookieHeader();
    res = await apiClient.get("/api/notifications/unread-count", {
      cache: "no-store",
      headers: { Cookie: cookieHeader },
    });
  } catch {
    return { isError: true, count: 0 };
  }

  let data;
  try { data = await res.json(); } catch {
    return { isError: true, count: 0 };
  }

  if (!res.ok) return { isError: true, count: 0 };
  return data;
};

export const markNotificationReadAction = async (notificationId: string) => {
  try {
    const cookieHeader = await getCookieHeader();
    await apiClient.patch(`/api/notifications/${notificationId}/read`, undefined, {
      headers: { Cookie: cookieHeader },
    });
  } catch { /* 읽음 처리 실패는 조용히 무시 */ }
};

export const markAllNotificationsReadAction = async () => {
  try {
    const cookieHeader = await getCookieHeader();
    await apiClient.patch("/api/notifications/read-all", undefined, {
      headers: { Cookie: cookieHeader },
    });
  } catch { /* 조용히 무시 */ }
};

export const getNotificationPreferencesAction = async () => {
  let res: Response;
  try {
    const cookieHeader = await getCookieHeader();
    res = await apiClient.get("/api/users/me/notification-preferences", {
      cache: "no-store",
      headers: { Cookie: cookieHeader },
    });
  } catch {
    return { isError: true, message: "네트워크 오류가 발생했습니다." };
  }

  let data;
  try { data = await res.json(); } catch {
    return { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }

  if (!res.ok) return { isError: true, message: data?.message ?? "설정을 불러오지 못했습니다." };
  return data;
};

export const updateNotificationPreferencesAction = async (
  preferences: Partial<Record<string, boolean>>,
) => {
  try {
    const cookieHeader = await getCookieHeader();
    await apiClient.patch("/api/users/me/notification-preferences", preferences, {
      headers: { Cookie: cookieHeader },
    });
  } catch { /* 조용히 무시 */ }
};
