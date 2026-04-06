"use client";

import { getFeedAction } from "@/app/actions/feed.action";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useEffect, useState, useCallback } from "react";

import FeedItem from "@/features/feed/ui/FeedItem/FeedItem";
import { shouldPriorityPostImage } from "@/features/feed/lib/feedImagePolicy";
import { FeedItemModel, PostResponse } from "@/features/feed/model/types";
import { mapPostListToFeedItems } from "@/features/feed/lib/mapPostToFeedItem";

const PAGE_SIZE = 10;

export default function FeedList({
  initialItems,
  initialCursor,
  initialHasNext,
}: {
  initialItems: FeedItemModel[];
  initialCursor: string | null;
  initialHasNext: boolean;
}) {
  const [items, setItems] = useState<FeedItemModel[]>(initialItems ?? []);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasNext, setHasNext] = useState<boolean>(initialHasNext);
  const [loading, setLoading] = useState(false);

  const fetchNext = useCallback(async () => {
    if (!hasNext || loading) return;

    setLoading(true);
    try {
      const result = await getFeedAction({ limit: PAGE_SIZE, cursor });

      if ("isError" in result) {
        console.error(result.message);
        return;
      }

      const nextPosts = result.data.items ?? [];
      const nextFeedItems = mapPostListToFeedItems(nextPosts as PostResponse[]);

      setItems((prev) => {
        const seen = new Set(prev.map((item) => item.id));
        const merged = [...prev];

        for (const item of nextFeedItems) {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            merged.push(item);
          }
        }

        return merged;
      });

      setCursor(result.data.pageInfo.nextCursor);
      setHasNext(result.data.pageInfo.hasNext);
    } finally {
      setLoading(false);
    }
  }, [cursor, hasNext, loading]);

  const { sentinelRef, isIntersecting } = useIntersectionObserver({
    enabled: hasNext && !loading,
    rootMargin: "300px",
  });

  useEffect(() => {
    if (isIntersecting && hasNext && !loading) {
      fetchNext();
    }
  }, [isIntersecting, hasNext, loading, fetchNext]);

  return (
    <main className="mt-10">
      <div className="max-w-142.5 w-140 ml-10">
        <ul>
          {items.map((post, idx) => (
            <FeedItem
              key={post.id}
              post={post}
              priorityPost={shouldPriorityPostImage(idx)}
            />
          ))}
        </ul>
      </div>

      <div ref={sentinelRef} className="h-2.5 bg-blue-600" />

      {loading && items.length > 0 ? (
        <div className="p-4 text-center">로딩중...</div>
      ) : null}
    </main>
  );
}
