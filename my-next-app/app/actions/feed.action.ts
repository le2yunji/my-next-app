"use server";

import apiClient from "../utils/api-client";

export const feedAction = async () => {
  const res = await apiClient.get("/api/feed");
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
        `피드를 불러오는데 실패했습니다. (HTTP 상태 코드: ${res.status})`,
      ...data,
    };
  }

  return data;
};
