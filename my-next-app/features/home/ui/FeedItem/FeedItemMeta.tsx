"use client";

import { Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLike } from "@/hooks/useLike";
import { togglePostLike } from "@/features/posts/api/togglePostLike";

export default function FeedItemMeta({
  postId,
  authorHandle,
  likeCount,
  isLiked,
  commentCount,
}: {
  postId: string;
  /** 작성자의 userId (handle). 댓글 시트/페이지에서 프로필 조회에 사용 */
  authorHandle: string;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
}) {
  const router = useRouter();
  const {
    liked,
    likeCount: likedCount,
    handleLike,
  } = useLike({
    initialLiked: isLiked,
    initialLikeCount: likeCount,
    onToggle: () => togglePostLike(postId),
  });

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
        onClick={() => router.push(`/users/${authorHandle}/posts/${postId}`)}
        className="flex items-center gap-1"
      >
        <MessageCircle size={22} className="text-cool-gray -scale-x-100" />
        <span className="text-sm font-bold text-cool-gray">{commentCount}</span>
      </button>
    </div>
  );
}
