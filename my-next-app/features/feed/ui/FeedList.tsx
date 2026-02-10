"use client";

import { getFeedAction } from "@/app/actions/feed.action";
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

type FeedResponse = {
  items: FeedItem[];
  nextCursor: string | null;
  hasNext: boolean;
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

  const API_BASE = "http://localhost:8080";
  const sentinelRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          console.log("센티넬이 화면에 들어왔다!");
          fetchNext();
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(target);

    // 4) cleanup(컴포넌트 사라질 때 감시 중지)
    return () => observer.disconnect();
  }, [loading]);

  return (
    <main style={{ maxWidth: 360, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Feed</h1>

      {loading && items.length === 0 ? (
        <div style={{ color: "#6b7280" }}>로딩중...</div>
      ) : null}

      <ul style={{ display: "grid", gap: 1, listStyle: "none", padding: 0 }}>
        {items &&
          items.map((post) => (
            <li
              key={post.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Link href={`/users/${post.author.id}`}>
                {post.author.nickname}
              </Link>

              {post.media?.length ? (
                <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                  {post.media.map((m, idx) => (
                    <div
                      key={`${post.id}-${idx}`}
                      style={{ borderRadius: 10, overflow: "hidden" }}
                    >
                      <img
                        src={`${API_BASE}${m.url}`}
                        alt=""
                        style={{
                          width: "320px",
                          height: "320px",
                          display: "block",
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              <div style={{ marginTop: 6 }}>{post.content}</div>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 12,
                  color: "#6b7280",
                }}
              >
                <span>❤️ {post.likeCount}</span>
                <span>💬 {post.commentCount}</span>
                <span style={{ marginLeft: "auto" }}>
                  {new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
      </ul>
      <div ref={sentinelRef} style={{ height: 10 }} />
      {loading && items.length > 0 ? (
        <div style={{ padding: 16, textAlign: "center", color: "#6b7280" }}>
          로딩중...
        </div>
      ) : null}
    </main>
  );
}
