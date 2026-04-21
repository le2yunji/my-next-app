"use client";

import { getFeedAction } from "@/app/actions/feed.action";
import { useInfiniteScrollList } from "@/hooks/useInfiniteScrollList";
import { shouldPriorityPostImage } from "@/features/home/lib/feedImagePolicy";
import FeedItem from "@/features/home/ui/FeedItem/FeedItem";
import { FeedItems } from "../types/feed.type";

const PAGE_SIZE = 10;

export default function FeedList({
  initialItems,
  initialCursor,
  initialHasNext,
}: {
  initialItems: FeedItems[];
  initialCursor: string | null;
  initialHasNext: boolean;
}) {
  const { items, loading, errorMsg, hasNext, sentinelRef } =
    useInfiniteScrollList<FeedItems>({
      initialItems: initialItems ?? [],
      initialCursor,
      initialHasNext,
      limit: PAGE_SIZE,
      getKey: (item) => item.id,
      fetchPage: async ({ cursor, limit }) => {
        const result = await getFeedAction({ limit, cursor });

        if ("isError" in result) {
          throw new Error(result.message);
        }

        return {
          items: result.items as FeedItems[],
          nextCursor: result.nextCursor ?? null,
          hasNext: Boolean(result.hasNext),
        };
      },
      errorMessage: "피드를 불러오지 못했습니다.",
      rootMargin: "100px",
    });

  return (
    <main className="w-full">
      <div className="w-full px-4 md:ml-10 md:w-140 md:max-w-142.5 md:px-0">
        {errorMsg ? (
          <p className="p-4 text-center text-sm text-red-500">{errorMsg}</p>
        ) : null}

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

      {hasNext ? <div ref={sentinelRef} className="h-2.5" /> : null}

      {loading && items.length > 0 ? (
        <div className="p-4 text-center">로딩중...</div>
      ) : null}
    </main>
  );
}
