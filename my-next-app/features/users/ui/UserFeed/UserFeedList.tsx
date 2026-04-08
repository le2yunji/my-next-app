"use client";

import { getUserFeedAction } from "@/app/actions/users.action";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { FeedItem } from "@/features/users/types/feed.type";
import FeedThumbnail from "@/features/users/ui/UserFeed/UserFeedThumbnail";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function UserFeedList({
  userId,
  initialItems,
  initialCursor,
  initialHasNext,
}: {
  userId: string;
  initialItems: FeedItem[];
  initialCursor: string | null;
  initialHasNext: boolean;
}) {
  const [items, setItems] = useState<FeedItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasNext, setHasNext] = useState(initialHasNext);

  const fetchNext = useCallback(async () => {
    if (!hasNext || loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await getUserFeedAction({
        userId,
        limit: 9,
        cursor,
      });

      setItems((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        const merged = [...prev];

        for (const item of data.items) {
          if (!seen.has(item.id)) merged.push(item);
        }

        return merged;
      });

      setCursor(data.nextCursor);
      setHasNext(data.hasNext);
    } catch {
      setErrorMsg("게시물을 불러오지 못했습니다.");
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
      {/* BoardList와 톤 맞춘 상단 헤더 */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
          {items.length} posts
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
        <div className="rounded-[24px] bg-[#F7F5F2] px-4 py-10 text-center">
          <p className="text-sm text-[#9CA3AF]">아직 게시물이 없습니다.</p>
        </div>
      ) : null}

      <ul className="grid grid-cols-3 gap-2.5">
        {items.map((post) => (
          <li key={post._id} className="relative">
            <Link
              href={`/users/${userId}/post/${post._id}`}
              className="group block"
            >
              <FeedThumbnail
                src={post.thumbnail?.url}
                alt={`${post.author}의 게시물`}
              />

              {/* 여러 장 게시물 표시 */}
              {post.mediaCount > 1 && (
                <div className="absolute top-2 right-2 rounded-full bg-black/55 px-2 py-1 text-[11px] font-medium leading-none text-white backdrop-blur-sm">
                  {post.mediaCount}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className="h-6" />

      {loading ? (
        <div className="pt-3 text-center text-sm text-[#9CA3AF]">
          불러오는 중...
        </div>
      ) : null}
    </section>
  );
}
