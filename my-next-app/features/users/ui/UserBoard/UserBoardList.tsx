"use client";

import { getUserBoardsAction } from "@/app/actions/users.action";
import BoardCard from "@/components/common/board-card";
import { useInfiniteScrollList } from "@/hooks/useInfiniteScrollList";
import type { BoardItem as BoardCardItem } from "@/types/board";
import type { BoardItem as UserBoardItem } from "@/features/users/types/board.type";

function toBoardCardItem(board: UserBoardItem): BoardCardItem {
  return {
    id: board._id,
    title: board.title,
    saveCount: board.saveCount,
    previewImages: board.previewImages ?? [],
  };
}

export default function UserBoardList({
  userId,
  initialItems,
  initialCursor,
  initialHasNext,
}: {
  userId: string;
  initialItems: UserBoardItem[];
  initialCursor: string | null;
  initialHasNext: boolean;
}) {
  const { items, loading, errorMsg, hasNext, sentinelRef } =
    useInfiniteScrollList<UserBoardItem>({
      initialItems,
      initialCursor,
      initialHasNext,
      limit: 6,
      getKey: (item) => item._id,
      fetchPage: async ({ cursor, limit }) => {
        const result = await getUserBoardsAction({
          userId,
          cursor,
          limit,
        });

        if ("isError" in result) {
          throw new Error(result.message);
        }

        return {
          items: result.items as UserBoardItem[],
          nextCursor: result.nextCursor ?? null,
          hasNext: Boolean(result.hasNext),
        };
      },
      errorMessage: "보드 목록을 불러오지 못했습니다.",
      rootMargin: "200px",
    });

  return (
    <section className="w-full px-5 pb-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
          {items.length} boards
        </h2>

        <button
          type="button"
          className="text-[15px] font-semibold text-[#F97316]"
        >
          Sort
        </button>
      </div>

      {errorMsg ? (
        <p className="mb-4 text-sm text-red-500">{errorMsg}</p>
      ) : null}

      {items.length === 0 && !loading ? (
        <div className="rounded-3xl bg-[#F7F5F2] px-4 py-10 text-center">
          <p className="text-sm text-[#9CA3AF]">아직 보드가 없습니다.</p>
        </div>
      ) : null}

      <ul className="grid grid-cols-2 gap-x-4 gap-y-6">
        {items.map((board) => (
          <li key={board._id}>
            <BoardCard
              board={toBoardCardItem(board)}
              size="md"
              href={`/users/${userId}/boards/${board._id}`}
              showArrow
            />
          </li>
        ))}
      </ul>

      {hasNext ? <div ref={sentinelRef} className="h-6" /> : null}

      {loading ? (
        <div className="pt-2 text-center text-sm text-[#9CA3AF]">
          불러오는 중...
        </div>
      ) : null}
    </section>
  );
}
