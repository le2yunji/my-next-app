"use client";

import { getUserBoardsAction } from "@/app/actions/users.action"; // boards 전용 액션 필요
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { BoardItem } from "@/features/users/types/board.type";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

function PreviewImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  // 이미지가 없을 때도 카드 레이아웃이 깨지지 않게 처리
  if (!src) {
    return <div className={`bg-[#E9E5DF] ${className ?? ""}`} />;
  }

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="object-cover"
        sizes="(max-width: 768px) 44vw, 240px"
      />
    </div>
  );
}

export default function UserBoardList({
  userId,
  initialItems,
  initialCursor,
  initialHasNext,
}: {
  userId: string;
  initialItems: BoardItem[];
  initialCursor: string | null;
  initialHasNext: boolean;
}) {
  const [items, setItems] = useState<BoardItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasNext, setHasNext] = useState(initialHasNext);

  const fetchNext = useCallback(async () => {
    if (!hasNext || loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await getUserBoardsAction({
        userId,
        limit: 6,
        cursor: null,
      });

      setItems((prev) => {
        const seen = new Set(prev.map((item) => item._id));
        const merged = [...prev];

        for (const item of data.items) {
          if (!seen.has(item._id)) merged.push(item);
        }

        return merged;
      });

      setCursor(data.nextCursor);
      setHasNext(data.hasNext);
    } catch {
      setErrorMsg("보드 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [cursor, hasNext, loading, userId]);

  const { sentinelRef, isIntersecting } = useIntersectionObserver({
    enabled: hasNext && !loading,
    rootMargin: "200px",
  });

  useEffect(() => {
    if (isIntersecting) {
      fetchNext();
    }
  }, [isIntersecting, fetchNext]);

  return (
    <section className="w-full px-5 pb-10">
      {/* 상단 헤더 */}
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

      {/* 2열 카드 그리드 */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6">
        {items.map((board) => {
          const [mainImage, subImage1, subImage2] = board.previewImages ?? [];

          return (
            <li key={board._id}>
              <Link
                href={`/users/${userId}/boards/${board._id}`}
                className="block"
              >
                <article className="group">
                  {/* 이미지 콜라주 카드 */}
                  <div className="overflow-hidden rounded-[24px] bg-[#F3F4F6]">
                    {/* 상단 큰 이미지 */}
                    <PreviewImage
                      src={mainImage?.url}
                      alt={board.title}
                      className="aspect-[1.6/1] w-full"
                    />

                    {/* 하단 작은 이미지 2장 */}
                    <div className="mt-[2px] grid grid-cols-2 gap-[2px]">
                      <PreviewImage
                        src={subImage1?.url}
                        alt={`${board.title} preview 1`}
                        className="aspect-square w-full"
                      />
                      <PreviewImage
                        src={subImage2?.url}
                        alt={`${board.title} preview 2`}
                        className="aspect-square w-full"
                      />
                    </div>
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="flex items-start justify-between px-1 pt-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-[17px] font-semibold leading-6 text-[#111827]">
                        {board.title}
                      </h3>
                      <p className="text-[13px] font-medium text-[#9CA3AF]">
                        {board.saveCount} saves
                      </p>
                    </div>

                    <span className="ml-3 mt-0.5 shrink-0 text-[24px] leading-none text-[#C7CDD4]">
                      ›
                    </span>
                  </div>
                </article>
              </Link>
            </li>
          );
        })}
      </ul>

      <div ref={sentinelRef} className="h-6" />

      {loading ? (
        <div className="pt-2 text-center text-sm text-[#9CA3AF]">
          불러오는 중...
        </div>
      ) : null}
    </section>
  );
}
