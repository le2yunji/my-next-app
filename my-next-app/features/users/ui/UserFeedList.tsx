"use client";

import { getFeedByUserAction } from "@/app/actions/feed.action";
import { useEffect, useState } from "react";

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

export default function UserFeedList({ userId }: { userId: string }) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const API_BASE = "http://localhost:8080";

  const fetchFirstPage = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await getFeedByUserAction({ userId });
      setItems(res.items);
    } catch (e: any) {
      setErrorMsg(e?.message ?? "failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirstPage();
  }, []);

  return (
    <main style={{ maxWidth: 360, margin: "0 auto", padding: 16 }}>
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

      {loading && items.length > 0 ? (
        <div style={{ padding: 16, textAlign: "center", color: "#6b7280" }}>
          로딩중...
        </div>
      ) : null}
    </main>
  );
}
