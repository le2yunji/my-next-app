"use server";
import apiClient from "@/app/utils/api-client";

export const getFeedAction = async (params: {
  limit?: number;
  cursor?: string | null;
}) => {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);

  const url = `/api/feed?${qs.toString()}`;
  const res = await apiClient.get(url, {
    cache: "no-store", // 커서 페이지네이션은 캐시 안 함
    credentials: "include",
  });

  if (!res.ok) {
    let data;
    try {
      data = await res.json();
    } catch {
      // JSON 파싱 실패 시 data는 빈 객체 유지
    }
    return {
      isError: true,
      message:
        data?.message ?? `피드를 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  try {
    return await res.json();
  } catch {
    return { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }
};
