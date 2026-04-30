/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

type ExploreItem = {
  id: string;
  imgUrl: string;
  title: string;
  likes: number;
  authorName: string;
  authorAvatar: string;
};

const TAGS = [
  "여행",
  "인테리어",
  "패션",
  "카페",
  "음식",
  "운동",
  "사진",
  "자연",
];

const BASE = "http://localhost:8080/static";

// 백엔드 탐색 API 연동 전까지 사용하는 mock 데이터
const EXPLORE_ITEMS: ExploreItem[] = [
  {
    id: "e1",
    imgUrl: `${BASE}/images/feed/interior1.webp`,
    title: "제주 일몰",
    likes: 2341,
    authorName: "haein",
    authorAvatar: `${BASE}/images/profiles/1.webp`,
  },
  {
    id: "e2",
    imgUrl: `${BASE}/images/feed/interior2.webp`,
    title: "미니멀 인테리어",
    likes: 1820,
    authorName: "sooyeon",
    authorAvatar: `${BASE}/images/profiles/2.webp`,
  },
  {
    id: "e3",
    imgUrl: `${BASE}/images/feed/fashion1.webp`,
    title: "서울 거리 패션",
    likes: 4100,
    authorName: "yujin",
    authorAvatar: `${BASE}/images/profiles/3.webp`,
  },
  {
    id: "e4",
    imgUrl: `${BASE}/images/feed/cafe1.webp`,
    title: "골든아워",
    likes: 987,
    authorName: "minjun",
    authorAvatar: `${BASE}/images/profiles/4.webp`,
  },
  {
    id: "e5",
    imgUrl: `${BASE}/images/feed/plant1.webp`,
    title: "한강 뷰",
    likes: 567,
    authorName: "junho",
    authorAvatar: `${BASE}/images/profiles/5.webp`,
  },
  {
    id: "e6",
    imgUrl: `${BASE}/images/feed/object1.webp`,
    title: "숲 산책",
    likes: 1234,
    authorName: "haein",
    authorAvatar: `${BASE}/images/profiles/1.webp`,
  },
  {
    id: "e7",
    imgUrl: `${BASE}/images/feed/cafe2.webp`,
    title: "카페 무드",
    likes: 2190,
    authorName: "sooyeon",
    authorAvatar: `${BASE}/images/profiles/2.webp`,
  },
  {
    id: "e8",
    imgUrl: `${BASE}/images/feed/fashion2.webp`,
    title: "빈티지 스타일",
    likes: 3450,
    authorName: "yujin",
    authorAvatar: `${BASE}/images/profiles/3.webp`,
  },
  {
    id: "e9",
    imgUrl: `${BASE}/images/feed/desk1.webp`,
    title: "도시 야경",
    likes: 1670,
    authorName: "minjun",
    authorAvatar: `${BASE}/images/profiles/4.webp`,
  },
  {
    id: "e10",
    imgUrl: `${BASE}/images/feed/pet1.webp`,
    title: "새벽 러닝",
    likes: 820,
    authorName: "junho",
    authorAvatar: `${BASE}/images/profiles/5.webp`,
  },
  {
    id: "e11",
    imgUrl: `${BASE}/images/feed/interior3.webp`,
    title: "바다 풍경",
    likes: 3210,
    authorName: "haein",
    authorAvatar: `${BASE}/images/profiles/1.webp`,
  },
  {
    id: "e12",
    imgUrl: `${BASE}/images/feed/plant2.webp`,
    title: "플랜트 인테리어",
    likes: 1450,
    authorName: "sooyeon",
    authorAvatar: `${BASE}/images/profiles/2.webp`,
  },
];

function fmtLikes(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
}

export default function ExploreGrid() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const filtered = EXPLORE_ITEMS.filter((item) => {
    const matchesQuery =
      query === "" ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.authorName.toLowerCase().includes(query.toLowerCase());
    const matchesTag = activeTag === null || item.title.includes(activeTag);
    return matchesQuery && matchesTag;
  });

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-6">
      {/* 검색바 */}
      <div className="relative mb-5">
        <Search
          size={17}
          strokeWidth={2}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-silver"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="검색어를 입력하세요"
          className={`h-11 w-full rounded-xl bg-linen py-0 pl-10 pr-4 text-sm outline-none transition-all ${
            focused
              ? "ring-[1.5px] ring-near-black"
              : "ring-[1.5px] ring-transparent"
          }`}
        />
      </div>

      {/* 태그 필터 */}
      <div className="scrollbar-none mb-5 flex gap-2 overflow-x-auto pb-1">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
              activeTag === tag
                ? "bg-near-black text-warm-white"
                : "bg-linen text-slate hover:bg-near-black hover:text-warm-white"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Masonry 그리드 */}
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-silver">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="columns-2 gap-2 sm:columns-3 md:columns-4 md:gap-3">
          {filtered.map((item) => (
            <div key={item.id} className="mb-2 break-inside-avoid md:mb-3">
              <div className="group relative cursor-pointer overflow-hidden rounded-xl bg-light-gray">
                <Image
                  src={item.imgUrl}
                  alt={item.title}
                  fill
                  unoptimized
                  className="block w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <p className="text-[12px] font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-white/70">
                      {/* 하트 아이콘 (SVG inline으로 fill 처리) */}
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="rgba(255,255,255,0.7)"
                        stroke="none"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                      {fmtLikes(item.likes)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 작성자 정보 */}
              <div className="mt-1.5 flex items-center gap-1.5 pl-0.5">
                <Image
                  src={item.authorAvatar}
                  alt={item.authorName}
                  width={18}
                  height={18}
                  className="rounded-full object-cover"
                  unoptimized
                />
                <span className="text-[11px] text-cool-gray">
                  {item.authorName}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
