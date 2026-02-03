export default async function FeedDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

  const res = await fetch(`${API_BASE}/feed/${params.id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return (
      <main style={{ padding: 16 }}>
        <a href="/feed">← 목록</a>
        <h1 style={{ marginTop: 12 }}>게시글을 찾을 수 없어요</h1>
      </main>
    );
  }

  const post = await res.json();

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <a href="/feed">← 목록</a>
      <h1 style={{ marginTop: 12, fontSize: 22, fontWeight: 700 }}>Post</h1>

      <div
        style={{
          marginTop: 12,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 12,
        }}
      >
        <div style={{ fontWeight: 700 }}>{post.author?.nickname}</div>
        <div style={{ marginTop: 6 }}>{post.content}</div>

        {post.media?.length ? (
          <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
            {post.media.map((m: any, idx: number) => (
              <div key={idx} style={{ borderRadius: 10, overflow: "hidden" }}>
                <img
                  src={m.url}
                  alt=""
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ marginTop: 10, color: "#6b7280" }}>
          ❤️ {post.likeCount} · 💬 {post.commentCount} ·{" "}
          {new Date(post.createdAt).toLocaleString()}
        </div>
      </div>
    </main>
  );
}
