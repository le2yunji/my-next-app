"use server";

import apiClient from "@/app/utils/api-client";
import type {
  RawApiBoard,
  RawApiBoardPageItem,
  MappedBoardPageItem,
  RawApiBoardDetail,
  MappedBoardDetail,
} from "@/types/board";
import type { BoardItem } from "@/features/users/types/board.type";

export const getUserBoardsAction = async (params: {
  userId: string;
  limit?: number;
  cursor?: string | null;
}) => {
  const url = `/api/users/${params.userId}/boards`;
  let data;
  try {
    const res = await apiClient.get(url, {
      credentials: "include",
      next: { revalidate: 60 },
    });
    data = await res.json();
    if (!res.ok) {
      return {
        isError: true,
        message:
          data?.message ??
          `보드 목록을 불러오는데 실패했습니다. (HTTP ${res.status})`,
        ...data,
      };
    }
  } catch {
    return { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }

  // 백엔드 응답 { user, boards } → 컴포넌트가 기대하는 { items, nextCursor, hasNext } 로 변환
  // 백엔드 boards 필드명: id → _id, itemCount → saveCount
  const items: BoardItem[] = (data?.boards ?? []).map((board: RawApiBoard) => ({
    _id: board.id,
    title: board.title,
    saveCount: board.itemCount,
    previewImages: board.previewImages ?? [],
  }));

  return {
    items,
    nextCursor: null,
    hasNext: false,
  };
};

export const getUserBoardPageAction = async (params: {
  userId: string;
  boardId: string;
  limit?: number;
  cursor?: string | null;
}) => {
  const url = `/api/users/${params.userId}/boards/${params.boardId}`;
  let data;
  try {
    const res = await apiClient.get(url, {
      credentials: "include",
      next: { revalidate: 60 },
    });
    data = await res.json();
    if (!res.ok) {
      return {
        isError: true,
        message:
          data?.message ??
          `보드 아이템을 불러오는데 실패했습니다. (HTTP ${res.status})`,
        ...data,
      };
    }
  } catch {
    return { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }

  const rawBoard: RawApiBoardDetail = data.board;
  const board: MappedBoardDetail = {
    id: rawBoard.id,
    ownerId: rawBoard.ownerId,
    title: rawBoard.title,
    description: rawBoard.description ?? "",
    coverImage: rawBoard.coverImage ?? null,
    visibility: rawBoard.visibility,
    itemCount: rawBoard.itemCount ?? 0,
    isOwner: rawBoard.isOwner ?? false,
  };

  const items: MappedBoardPageItem[] = (data?.items ?? []).map(
    (item: RawApiBoardPageItem) => ({
      boardItemId: item.id,
      boardId: item.boardId,
      ownerId: item.ownerId,
      postId: item.postId,
      note: item.note,
      mediaOrder: item.savedMediaOrder,
      thumbnailUrl: item.thumbnailUrl ?? null,
    }),
  );

  return {
    board,
    items,
    nextCursor: data.nextCursor ?? null,
    hasNext: data.hasNext ?? false,
  };
};
