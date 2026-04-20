/* eslint-disable @next/next/no-img-element */
"use client";

import BoardCard from "@/components/common/board-card";
import type { BoardItem } from "@/types/board";

// 백엔드 저장됨 API 연동 전까지 사용하는 mock 데이터
const MOCK_BOARDS: BoardItem[] = [
  {
    id: "b1",
    title: "여행 기록",
    saveCount: 48,
    previewImages: [
      { id: "b1a", url: "https://picsum.photos/seed/b1a/600/400" },
      { id: "b1b", url: "https://picsum.photos/seed/b1b/400/300" },
      { id: "b1c", url: "https://picsum.photos/seed/b1c/400/300" },
    ],
  },
  {
    id: "b2",
    title: "인테리어 무드",
    saveCount: 112,
    previewImages: [
      { id: "b2a", url: "https://picsum.photos/seed/b2a/600/400" },
      { id: "b2b", url: "https://picsum.photos/seed/b2b/400/300" },
      { id: "b2c", url: "https://picsum.photos/seed/b2c/400/300" },
    ],
  },
  {
    id: "b3",
    title: "패션 레퍼런스",
    saveCount: 76,
    previewImages: [
      { id: "b3a", url: "https://picsum.photos/seed/b3a/600/400" },
      { id: "b3b", url: "https://picsum.photos/seed/b3b/400/300" },
    ],
  },
  {
    id: "b4",
    title: "카페 투어",
    saveCount: 33,
    previewImages: [
      { id: "b4a", url: "https://picsum.photos/seed/b4a/600/400" },
      { id: "b4b", url: "https://picsum.photos/seed/b4b/400/300" },
      { id: "b4c", url: "https://picsum.photos/seed/b4c/400/300" },
    ],
  },
  {
    id: "b5",
    title: "음식 기록",
    saveCount: 29,
    previewImages: [{ id: "b5a", url: "https://picsum.photos/seed/b5a/600/400" }],
  },
  {
    id: "b6",
    title: "읽고 싶은 책",
    saveCount: 17,
    previewImages: [
      { id: "b6a", url: "https://picsum.photos/seed/b6a/600/400" },
      { id: "b6b", url: "https://picsum.photos/seed/b6b/400/300" },
      { id: "b6c", url: "https://picsum.photos/seed/b6c/400/300" },
    ],
  },
];

// 최근 저장 아이템 mock (Masonry)
const RECENT_ITEMS = [
  { id: "r1", imgUrl: "https://picsum.photos/seed/ex1/400/600", title: "제주 일몰" },
  { id: "r2", imgUrl: "https://picsum.photos/seed/ex3/400/700", title: "서울 거리 패션" },
  { id: "r3", imgUrl: "https://picsum.photos/seed/ex5/400/400", title: "한강 뷰" },
  { id: "r4", imgUrl: "https://picsum.photos/seed/ex8/400/550", title: "빈티지 스타일" },
  { id: "r5", imgUrl: "https://picsum.photos/seed/ex10/400/640", title: "새벽 러닝" },
  { id: "r6", imgUrl: "https://picsum.photos/seed/ex12/400/500", title: "플랜트 인테리어" },
  { id: "r7", imgUrl: "https://picsum.photos/seed/ex2/400/400", title: "미니멀 인테리어" },
  { id: "r8", imgUrl: "https://picsum.photos/seed/ex11/400/400", title: "바다 풍경" },
];

export default function SavedView() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-6">
      <h1 className="mb-5 text-xl font-bold">저장됨</h1>

      {/* 보드 그리드 */}
      <ul className="mb-8 grid grid-cols-2 gap-3">
        {MOCK_BOARDS.map((board) => (
          <li key={board.id}>
            <BoardCard board={board} size="md" showArrow />
          </li>
        ))}
      </ul>

      {/* 최근 저장 Masonry */}
      <h2 className="mb-4 text-base font-bold">최근 저장</h2>
      <div className="columns-2 gap-2 sm:columns-3 md:gap-3">
        {RECENT_ITEMS.map((item) => (
          <div key={item.id} className="mb-2 break-inside-avoid md:mb-3">
            <div className="overflow-hidden rounded-xl bg-light-gray">
              <img
                src={item.imgUrl}
                alt={item.title}
                className="block w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
