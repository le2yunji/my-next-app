"use server";

import apiClient from "@/shared/api/api-client";
import { getMeServer } from "@/entities/session/api/getMeServer";
import type { BoardItem as PublicBoardItem } from "@/shared/ui/board";
import type {
  RawApiBoard,
  RawApiBoardPageItem,
  MappedBoardPageItem,
  RawApiBoardDetail,
  MappedBoardDetail,
  UserBoardListItem,
} from "@/features/boards/types/board.type";

// 유저 프로필 보드 탭 (UserBoardList)용 — _id 형식
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
  const items: UserBoardListItem[] = (data?.boards ?? []).map(
    (board: RawApiBoard) => ({
      _id: board.id,
      title: board.title,
      saveCount: board.itemCount,
      previewImages: board.previewImages ?? [],
    }),
  );

  return {
    items,
    nextCursor: null,
    hasNext: false,
  };
};

// 저장됨 페이지 (SavedView)용 — 현재 로그인 유저 보드, id 형식
export const getMyBoardsAction = async (): Promise<
  | { boards: PublicBoardItem[]; userId: string }
  | { isError: true; message: string }
> => {
  const me = await getMeServer();
  if (!me) return { isError: true, message: "로그인이 필요합니다." };

  const url = `/api/users/${me.userId}/boards`;
  let data;
  try {
    const res = await apiClient.get(url, { cache: "no-store" });
    data = await res.json();
    if (!res.ok) {
      return {
        isError: true,
        message: data?.message ?? "보드 목록을 불러오지 못했습니다.",
      };
    }
  } catch {
    return { isError: true, message: "네트워크 오류가 발생했습니다." };
  }

  const boards: PublicBoardItem[] = (data?.boards ?? []).map(
    (board: RawApiBoard) => ({
      id: board.id,
      title: board.title,
      saveCount: board.itemCount,
      previewImages: board.previewImages ?? [],
    }),
  );

  return { boards, userId: me.userId };
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
