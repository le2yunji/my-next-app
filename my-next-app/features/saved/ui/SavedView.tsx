import BoardCard from "@/components/common/board-card";
import type { BoardItem } from "@/types/board";
import Image from "next/image";

export default function SavedView({
  boards,
  userId,
}: {
  boards: BoardItem[];
  userId: string;
}) {
  // 모든 보드의 previewImages를 모아 최근 저장 섹션에 표시
  const recentImages = boards.flatMap((board) => board.previewImages).slice(0, 12);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-6">
      <h1 className="mb-5 text-xl font-bold">저장됨</h1>

      {boards.length === 0 ? (
        <div className="rounded-3xl bg-[#F7F5F2] px-4 py-10 text-center">
          <p className="text-sm text-[#9CA3AF]">아직 보드가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* 보드 그리드 */}
          <ul className="mb-8 grid grid-cols-2 gap-3">
            {boards.map((board) => (
              <li key={board.id}>
                <BoardCard
                  board={board}
                  size="md"
                  href={`/users/${userId}/boards/${board.id}`}
                  showArrow
                />
              </li>
            ))}
          </ul>

          {/* 최근 저장 — 보드 previewImages 취합 */}
          {recentImages.length > 0 && (
            <>
              <h2 className="mb-4 text-base font-bold">최근 저장</h2>
              <div className="columns-2 gap-2 sm:columns-3 md:gap-3">
                {recentImages.map((img) => (
                  <div key={img.id} className="mb-2 break-inside-avoid md:mb-3">
                    <div className="overflow-hidden rounded-xl bg-[#ECE7E1]">
                      <Image
                        src={img.url}
                        alt=""
                        width={400}
                        height={400}
                        unoptimized
                        className="block w-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
