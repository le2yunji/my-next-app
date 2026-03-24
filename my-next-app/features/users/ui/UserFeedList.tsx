"use client";

import { getUserFeedAction } from "@/app/actions/users.action";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type FeedItem = {
  id: string;
  thumbnail: { type: "image"; url: string } | null;
  mediaCount: number;
  author: { id: string; nickname: string; profileImage: string | null };
  // likeCount: number;
  // commentCount: number;
  createdAt: string;
};

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

  console.log("items: ", items);

  const fetchNext = async () => {
    if (!hasNext || loading) return;

    setLoading(true);

    try {
      const data = await getUserFeedAction({ userId, limit: 9, cursor });

      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        for (const it of data.items) {
          if (!seen.has(it.id)) merged.push(it);
        }
        return merged;
      });

      setCursor(data.nextCursor);
      setHasNext(data.hasNext);
    } finally {
      setLoading(false);
    }
  };

  const { sentinelRef, isIntersecting } = useIntersectionObserver({
    enabled: hasNext && !loading,
    rootMargin: "200px", // 바닥 닿기 전에 미리 로드
  });

  useEffect(() => {
    if (isIntersecting) fetchNext();
  }, [isIntersecting]);

  return (
    <main className="w-[393px]">
      {loading && items.length === 0 ? (
        <div style={{ color: "#6b7280" }}>로딩중...</div>
      ) : null}

      <ul className="grid grid-cols-3">
        {items &&
          items.map((post) => (
            <li key={post.id} className="relative">
              {post.thumbnail ? (
                <div className="relative aspect-square w-full overflow-hidden">
                  <Link
                    href={`/users/${userId}/${post.id}`}
                    className="relative block aspect-square w-full overflow-hidden"
                  >
                    <Image
                      src={post.thumbnail.url}
                      alt=""
                      fill
                      className="object-cover p-0.5"
                      unoptimized // 임시
                      priority
                    />
                  </Link>
                </div>
              ) : null}

              {/* 멀티 이미지 표시 아이콘 */}
              {post.mediaCount > 1 && (
                <div className="absolute top-2 right-2 text-white text-xs bg-black/60 px-1 rounded">
                  {post.mediaCount}
                </div>
              )}
            </li>
          ))}
      </ul>

      <div ref={sentinelRef} className="h-2.5" />

      {loading && items.length > 0 ? (
        <div className="p-4 text-center">로딩중...</div>
      ) : null}
    </main>
  );
}
