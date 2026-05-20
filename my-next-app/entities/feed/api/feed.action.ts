"use server";

import apiClient from "@/shared/api/api-client";
import { getServerAuthHeaders } from "@/shared/lib/server/auth-headers";
export const getFeedAction = async (params: {
  limit?: number;
  cursor?: string | null;
}) => {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);

  const url = `/api/feed?${qs.toString()}`;
  let res: Response;
  try {
    const headers = await getServerAuthHeaders();
    res = await apiClient.get(url, {
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

  if (!res.ok) {
    return {
      isError: true,
      message:
        data?.message ?? `피드를 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};
