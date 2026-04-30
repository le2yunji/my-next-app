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

export const getPostCommentsAction = async (params: {
  postId: string;
  cursor?: string | null;
  limit?: number;
}) => {
  const qs = new URLSearchParams();
  if (params.cursor) qs.set("cursor", params.cursor);
  if (params.limit != null) qs.set("limit", String(params.limit));

  const url = `/api/post/${params.postId}/comments?${qs.toString()}`;

  let res: Response;
  try {
    const cookieHeader = await getCookieHeader();
    res = await apiClient.get(url, {
      cache: "no-store",
      headers: { Cookie: cookieHeader },
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
        data?.message ??
        `댓글 목록을 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};

export const toggleCommentLikeAction = async (params: {
  postId: string;
  commentId: string;
}) => {
  let res;
  try {
    const cookieHeader = await getCookieHeader();
    res = await apiClient.post(
      `/api/post/${params.postId}/comments/${params.commentId}/like`,
      undefined,
      { headers: { Cookie: cookieHeader } },
    );
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
        data?.message ??
        `댓글 좋아요 처리에 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};

export const deletePostCommentAction = async (params: {
  postId: string;
  commentId: string;
}) => {
  let res;
  try {
    const cookieHeader = await getCookieHeader();
    res = await apiClient.delete(
      `/api/post/${params.postId}/comments/${params.commentId}`,
      { headers: { Cookie: cookieHeader } },
    );
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
        data?.message ?? `댓글 삭제에 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};

export const updatePostCommentAction = async (params: {
  postId: string;
  commentId: string;
  content: string;
}) => {
  let res;
  try {
    const cookieHeader = await getCookieHeader();
    res = await apiClient.patch(
      `/api/post/${params.postId}/comments/${params.commentId}`,
      { content: params.content },
      { headers: { Cookie: cookieHeader } },
    );
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
        data?.message ?? `댓글 수정에 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};

export const createPostCommentAction = async (params: {
  postId: string;
  content: string;
  parentCommentId?: string | null;
}) => {
  let res;
  try {
    const cookieHeader = await getCookieHeader();
    res = await apiClient.post(
      `/api/post/${params.postId}/comments`,
      {
        content: params.content,
        parentCommentId: params.parentCommentId ?? null,
      },
      { headers: { Cookie: cookieHeader } },
    );
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
        data?.message ?? `댓글 작성에 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};
