"use server";
import apiClient from "@/app/utils/api-client";

export const getUserFeedAction = async (params: {
  userId: string;
  limit?: number;
  cursor?: string | null;
}) => {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);

  const url = `/api/users/${params.userId}/posts?${qs.toString()}`;
  const res = await apiClient.get(url, { next: { revalidate: 120 } }); // 자주 안 바뀌므로 120초

  let data;

  try {
    data = await res.json();
  } catch {
    data = { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }
  if (!res.ok) {
    return {
      isError: true,
      message:
        data?.message ??
        `유저 피드를 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};

export const getUserProfileAction = async (params: { userId: string }) => {
  const url = `/api/users/${params.userId}/profile`;
  const res = await apiClient.get(url, { next: { revalidate: 300 } });

  let data;

  try {
    data = await res.json();
  } catch {
    data = { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }
  if (!res.ok) {
    return {
      isError: true,
      message:
        data?.message ??
        `유저 피드를 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};
