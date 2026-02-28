"use client";

import { getFeedAction } from "@/app/actions/feed.action";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type FeedItem = {
  id: string;
  content: string;
  author: { id: string; nickname: string; profileImage: string | null };
  likeCount: number;
  commentCount: number;
  createdAt: string;
  media?: { type: "image"; url: string }[];
};

export default function FeedList({
  initialItems,
  initialCursor,
  initialHasNext,
}: {
  initialItems: FeedItem[];
  initialCursor: string | null;
  initialHasNext: boolean;
}) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [items, setItems] = useState(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasNext, setHasNext] = useState(initialHasNext);
  const [loading, setLoading] = useState(false);

  const fetchNext = async () => {
    if (!hasNext || loading) return;
    setLoading(true);
    try {
      const data = await getFeedAction({ limit: 10, cursor }); //  추가 로드
      setItems((prev) => [...prev, ...data.items]);
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
    if (isIntersecting && hasNext && !loading) fetchNext();
  }, [isIntersecting, hasNext, loading]);

  return (
    <main className="w-[393px] mt-10">
      <h1 className="font-2xl-bold">Feed</h1>

      {loading && items.length === 0 ? <div>로딩중...</div> : null}

      <ul>
        {items &&
          items.map((post) => (
            <li key={post.id} className="mt-20">
              <Link href={`/users/${post.author.id}`}>
                {post.author.nickname}
              </Link>

              {post.media?.length ? (
                <div className="grid">
                  {post.media.map((m, idx) => (
                    <div
                      key={`${post.id}-${idx}`}
                      className="relative mt-5 w-full aspect-393/320 overflow-hidden"
                    >
                      <Image
                        src={m.url}
                        alt={""}
                        fill
                        className="object-cover"
                        priority // 수정해야 함
                        unoptimized // 임시
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              <div>{post.content}</div>
              <div className="mt-2.5 flex gap-3">
                <span>❤️ {post.likeCount}</span>
                <span>💬 {post.commentCount}</span>
                <span className="ml-auto">
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
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
