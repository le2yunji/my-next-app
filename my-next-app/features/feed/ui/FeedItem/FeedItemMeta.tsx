"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FeedItemMeta({
  postId,
  likeCount,
  commentCount,
  thumbnailUrl,
}: {
  postId: string;
  likeCount: number;
  commentCount: number;
  thumbnailUrl?: string;
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
        onClick={() => {
          const qs = thumbnailUrl
            ? `?img=${encodeURIComponent(thumbnailUrl)}`
            : "";
          router.push(`/posts/${postId}/comments${qs}`);
        }}
        className="flex items-center gap-1"
      >
        <MessageCircle size={22} className="text-cool-gray -scale-x-100" />
        <span className="text-sm font-bold text-cool-gray">{commentCount}</span>
      </button>
    </div>
  );
}
