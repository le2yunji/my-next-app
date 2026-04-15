// app/(main)/users/[userId]/boards/[boardId]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUserBoardPageAction } from "@/app/actions/boards.action";
import type { MappedBoardPageItem } from "@/types/board";

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ userId: string; boardId: string }>;
}) {
  const { userId, boardId } = await params;
  const result = await getUserBoardPageAction({ userId, boardId });

  if ("isError" in result) {
    if (result.code === "BOARD_NOT_FOUND" || result.code === "USER_NOT_FOUND") {
      notFound();
    }
    return (
      <div className="px-5 py-10 text-center text-sm text-red-500">
        {result.message}
      </div>
    );
  }

  const { board, items } = result;

  return (
    <div className="pb-10">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4">
        <Link
          href={`/users/${userId}?tab=boards`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#6B7280]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Boards
        </Link>

        <h1 className="text-[22px] font-bold text-[#111827]">{board.title}</h1>

        {board.description ? (
          <p className="mt-1.5 text-[15px] text-[#6B7280]">
            {board.description}
          </p>
        ) : null}

        <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
          {board.itemCount} items
        </p>
      </div>

      {/* 아이템 그리드 */}
      {items.length === 0 ? (
        <div className="mx-5 rounded-3xl bg-[#F7F5F2] px-4 py-10 text-center">
          <p className="text-sm text-[#9CA3AF]">아직 저장된 항목이 없습니다.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-3 gap-2.5 px-5">
          {items.map((item: MappedBoardPageItem) => (
            <BoardItemThumbnail
              key={item.boardItemId}
              item={item}
              userId={userId}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function BoardItemThumbnail({
  item,
  userId,
}: {
  item: MappedBoardPageItem;
  userId: string;
}) {
  return (
    <li>
      <Link
        href={`/users/${userId}/posts/${item.postId}`}
        className="group block"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-[18px] bg-[#ECE7E1]">
          {item.thumbnailUrl ? (
            <Image
              src={item.thumbnailUrl}
              alt=""
              fill
              unoptimized
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 30vw, 180px"
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-black/4" />
        </div>
        {item.note ? (
          <p className="mt-1.5 line-clamp-2 px-0.5 text-[12px] text-[#6B7280]">
            {item.note}
          </p>
        ) : null}
      </Link>
    </li>
  );
}
