import { notFound } from "next/navigation";
import Image from "next/image";
import { getUserBoardPageAction } from "@/app/actions/boards.action";
import type { MappedBoardPageItem } from "@/features/boards/types/board.type";

export default async function UserDetailBoard({
  params,
}: {
  params: Promise<{ userId: string; boardId: string }>;
}) {
  const { userId, boardId } = await params;
  const data = await getUserBoardPageAction({ userId, boardId });

  if ("isError" in data) {
    if (data.code === "USER_NOT_FOUND" || data.code === "BOARD_NOT_FOUND") {
      notFound();
    }
    return <div className="m-10 bg-white p-6">에러: {data.message}</div>;
  }

  const { board, items } = data;

  return (
    <div className="bg-white">
      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">{board.title}</h1>
        {board.description ? (
          <p className="mt-1 text-sm text-gray-500">{board.description}</p>
        ) : null}
        <p className="mt-2 text-sm text-gray-400">{board.itemCount}개 저장됨</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl mx-5 bg-[#F7F5F2] px-4 py-10 text-center">
          <p className="text-sm text-[#9CA3AF]">아직 저장된 항목이 없습니다.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-0.5 px-5">
          {items.map((item: MappedBoardPageItem) => (
            <li
              key={item.boardItemId}
              className="relative aspect-square overflow-hidden rounded-lg bg-[#F3F4F6]"
            >
              {item.thumbnailUrl ? (
                <Image
                  src={item.thumbnailUrl}
                  fill
                  alt=""
                  className="object-cover"
                  loading="eager"
                  unoptimized
                />
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
