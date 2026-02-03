"use client";

import apiClient from "@/app/utils/api-client";
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

export default function FeedForm() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const API_BASE = "http://localhost:8080";

  const fetchFirstPage = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const qs = new URLSearchParams();
      qs.set("limit", "30");

      const res = await apiClient.get(`/api/feed?${qs.toString()}`);

      console.log(res);
      if (!res.ok) throw new Error(`feed fetch failed (HTTP ${res.status})`);

      const data: FeedResponse = await res.json();
      setItems(data.items);
    } catch (e: any) {
      setErrorMsg(e?.message ?? "failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 최초 1회만 호출
  useEffect(() => {
    fetchFirstPage();
  }, []);

  useEffect(() => {
    console.log("items changed:", items);
  }, [items]);

  return (
    <main style={{ maxWidth: 360, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Feed</h1>

      {loading && items.length === 0 ? (
        <div style={{ color: "#6b7280" }}>로딩중...</div>
      ) : null}

      <ul style={{ display: "grid", gap: 12, listStyle: "none", padding: 0 }}>
        {items.map((post) => (
          <li
            key={post.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 700 }}>{post.author.nickname}</div>

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
