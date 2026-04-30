"use client";

import { Heart, MessageCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { togglePostLike } from "@/features/posts/api/togglePostLike";
import { useOptimisticToggleCount } from "@/hooks/useOptimisticToggleCount";
import { toast } from "sonner";

export default function FeedItemMeta({
  postId,
  authorHandle,
  likeCount,
  isLiked,
  commentCount,
  isLoggedIn,
}: {
  postId: string;
  /** 작성자의 userId (handle). 댓글 시트/페이지에서 프로필 조회에 사용 */
  authorHandle: string;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    active: liked,
    count: likedCount,
    toggle: handleLike,
  } = useOptimisticToggleCount({
    initialActive: isLiked,
    initialCount: likeCount,
    canToggle: isLoggedIn,
    onBlocked: () => {
      toast.warning("로그인이 필요합니다.");
      //로그인 성공 후 다시 돌아올 위치를 login 페이지에 알려주는 주소
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    },

    onToggle: async () => {
      const result = await togglePostLike(postId);
      if ("isError" in result) return result;
      return {
        active: result.liked,
        count: result.likeCount,
      };
    },
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
