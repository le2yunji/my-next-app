"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function formatRelativeTime(createdAt: string): string {
  const now = new Date();
  const date = new Date(createdAt);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function FeedItemMeta({
  postId,
  likeCount,
  commentCount,
  createdAt,
}: {
  postId: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likedCount, setLikedCount] = useState(likeCount);

  const handleLike = () => {
    setLikedCount((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);
  };

  return (
    <div className="mt-2.5 flex gap-3">
      <button
        type="button"
        onClick={handleLike}
        className="flex items-center gap-1"
      >
        <Heart
          size={22}
          className={liked ? "fill-red text-red" : "text-cool-gray"}
        />
        <span className="text-sm font-bold text-cool-gray">{likedCount}</span>
      </button>

      <button
        type="button"
        onClick={() => router.push(`/posts/${postId}/comments`)}
        className="flex items-center gap-1"
      >
        <MessageCircle size={22} className="text-cool-gray -scale-x-100" />
        <span className="text-sm font-bold text-cool-gray">{commentCount}</span>
      </button>

      <span className="ml-auto text-[14px] text-cool-gray/90">
        {formatRelativeTime(createdAt)}
      </span>
    </div>
  );
}
