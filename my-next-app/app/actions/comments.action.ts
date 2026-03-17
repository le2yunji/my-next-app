"use server";
import apiClient from "@/app/utils/api-client";

export const getCommentsAction = async (params: { postId: string }) => {
  const url = `/api/posts/${params.postId}/comments`;
  const res = await apiClient.get(url);

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
        `게시글 댓글을 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};
