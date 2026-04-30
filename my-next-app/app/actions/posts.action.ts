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

export async function togglePostLikeAction(
  postId: string,
): Promise<
  { liked: boolean; likeCount: number } | { isError: true; message: string }
> {
  try {
    const res = await apiClient.post(`/api/post/${postId}/like`, undefined, {
      headers: { Cookie: await getCookieHeader() },
    });
    const data = (await res.json()) as { liked: boolean; likeCount: number };

    return data;
  } catch (e) {
    return {
      isError: true,
      message: (e as Error).message ?? "좋아요 처리 중 오류가 발생했습니다.",
    };
  }
}

type PostMedia = { url: string; type: "image" | "video"; order: number };

export async function createPostAction(params: {
  userId: string;
  content: string;
  media: PostMedia[];
}) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  let res: Response;
  try {
    res = await apiClient.post(
      `/api/users/${params.userId}/post`,
      { content: params.content, media: params.media },
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
      message: data?.message ?? `게시물 등록 실패 (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
}

// 피드 상세
export default async function getPostDetailAction(params: {
  userId: string;
  postId: string;
}) {
  const url = `/api/users/${params.userId}/post/${params.postId}`;
  let res: Response;
  try {
    res = await apiClient.get(url, { credentials: "include" });
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
        `게시물 상세 페이지를 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
}
