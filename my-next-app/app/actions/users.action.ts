"use server";

import apiClient from "@/app/utils/api-client";
import { getUserProfile } from "../services/user.service";

// 유저 피드 페이지 (썸네일만)
export const getUserFeedAction = async (params: {
  userId: string;
  limit?: number;
  cursor?: string | null;
}) => {
  const qs = new URLSearchParams();
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);

  const url = `/api/users/${params.userId}/feed?${qs.toString()}`;
  let res: Response;
  try {
    res = await apiClient.get(url, { next: { revalidate: 120 } }); // 자주 안 바뀌므로 120초
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
        `유저 피드를 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return data;
};

export const getUserProfileAction = async (params: { userId: string }) => {
  return await getUserProfile({ userId: params.userId });
};

export const getUserBoardsAction = async (params: {
  userId: string;
  limit?: number;
  cursor?: string | null;
}) => {
  const url = `/api/users/${params.userId}/boards`;
  let res: Response;
  try {
    res = await apiClient.get(url, {
      credentials: "include",
      next: { revalidate: 60 },
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
        `보드 목록을 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  // 백엔드 응답 { user, boards } → 컴포넌트가 기대하는 { items, nextCursor, hasNext } 로 변환
  // 백엔드 boards 필드명: id → _id, itemCount → saveCount
  const items = (data?.boards ?? []).map(
    (board: {
      id: string;
      title: string;
      itemCount: number;
      previewImages?: { id: string; url: string }[];
      [key: string]: unknown;
    }) => ({
      _id: board.id,
      title: board.title,
      saveCount: board.itemCount,
      previewImages: board.previewImages ?? [],
    })
  );

  return {
    items,
    nextCursor: null,
    hasNext: false,
  };
};
