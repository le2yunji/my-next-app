"use client";

import { getFeedAction } from "@/app/actions/feed.action";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useEffect, useState } from "react";

import FeedItem from "@/features/feed/ui/FeedItem/FeedItem";
import { shouldPriorityPostImage } from "@/features/feed/lib/feedImagePolicy";
import { FeedItemModel } from "../model/types";

export default function FeedList({
  initialItems,
  initialCursor,
  initialHasNext,
}: {
  initialItems: FeedItemModel[];
  initialCursor: string | null;
  initialHasNext: boolean;
}) {
  const [items, setItems] = useState<FeedItemModel[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasNext, setHasNext] = useState<boolean>(initialHasNext);
  const [loading, setLoading] = useState(false);

  const fetchNext = async () => {
    if (!hasNext || loading) return;
    setLoading(true);
    try {
      const data = await getFeedAction({ limit: 10, cursor });

      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        for (const it of data.items as FeedItemModel[]) {
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
    rootMargin: "200px",
  });

  // useEffect(() => {
  //   console.log(items.length);
  // }, [items.length]);

  useEffect(() => {
    if (isIntersecting && hasNext && !loading) fetchNext();
  }, [isIntersecting, hasNext, loading]);

  return (
    <main className="w-[393px] mt-10">
      <h1 className="font-2xl-bold">Feed</h1>

      <ul>
        {items.map((post, idx) => (
          <FeedItem
            key={post.id}
            post={post}
            priorityPost={shouldPriorityPostImage(idx)}
          />
        ))}
      </ul>

      <div ref={sentinelRef} className="h-2.5" />

      {loading && items.length > 0 ? (
        <div className="p-4 text-center">로딩중...</div>
      ) : null}
    </main>
  );
}
