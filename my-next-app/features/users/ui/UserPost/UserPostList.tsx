"use client";

import { getUserFeedAction } from "@/app/actions/users.action";
import { useInfiniteScrollList } from "@/hooks/useInfiniteScrollList";
import { FeedItem } from "@/features/users/types/feed.type";
import PostThumbnail from "@/features/users/ui/UserPost/UserPostThumbnail";
import Link from "next/link";

function MultiPhotoBadge({ count }: { count: number }) {
  return (
    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[11px] font-medium leading-none text-white backdrop-blur-sm">
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M5 15V7a2 2 0 0 1 2-2h8" />
      </svg>
      <span>{count}</span>
    </div>
  );
}

export default function UserPostList({
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
  const { items, loading, errorMsg, sentinelRef } =
    useInfiniteScrollList<FeedItem>({
      initialItems,
      initialCursor,
      initialHasNext,
      limit: 9,
      getKey: (item) => item.id,
      fetchPage: ({ cursor, limit }) =>
        getUserFeedAction({
          userId,
          cursor,
          limit,
        }),
      errorMessage: "게시물을 불러오지 못했습니다.",
      rootMargin: "200px",
    });

  return (
    <section className="w-full px-5 pb-10">
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
        <div className="rounded-3xl bg-[#F7F5F2] px-4 py-10 text-center">
          <p className="text-sm text-[#9CA3AF]">아직 게시물이 없습니다.</p>
        </div>
      ) : null}

      <ul className="grid grid-cols-3 gap-2.5">
        {items.map((post) => (
          <li key={post._id} className="relative">
            <Link
              href={`/users/${userId}/posts/${post._id}`}
              className="group block"
            >
              <PostThumbnail
                src={post.thumbnail?.url}
                alt={
                  typeof post.author === "string"
                    ? `${post.author}의 게시물`
                    : "게시물 썸네일"
                }
              />

              {post.mediaCount > 1 && (
                <MultiPhotoBadge count={post.mediaCount} />
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
