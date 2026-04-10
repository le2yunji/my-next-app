"use server";

import apiClient from "@/app/utils/api-client";

// 피드 상세
export const getPostDetailAction = async (params: {
  userId: string;
  postId: string;
}) => {
  const url = `/api/users/${params.userId}/posts/${params.postId}`;
  const res = await apiClient.get(url, {
    credentials: "include",
  });

  let data;

  try {
    data = await res.json();
  } catch {
    data = {
      isError: true,
      message: "서버 응답 형식이 올바르지 않습니다.",
    };
  }

  if (!res.ok) {
    return {
      isError: true,
      message:
        data?.message ??
        `게시물 상세 페이지를 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};
