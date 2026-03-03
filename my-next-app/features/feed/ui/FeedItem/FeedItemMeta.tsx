"use client";

export default function FeedItemMeta({
  likeCount,
  commentCount,
  createdAt,
}: {
  likeCount: number;
  commentCount: number;
  createdAt: string;
}) {
  return (
    <div className="mt-2.5 flex gap-3">
      <span>❤️ {likeCount}</span>
      <span>💬 {commentCount}</span>
      <span className="ml-auto">{new Date(createdAt).toLocaleString()}</span>
    </div>
  );
}
