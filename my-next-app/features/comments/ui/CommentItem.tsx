"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { formatRelativeTime } from "@/features/comments/utils/formatRelativeTime";
import { toast } from "sonner";
import {
  deletePostCommentAction,
  updatePostCommentAction,
  toggleCommentLikeAction,
} from "@/app/actions/comments.action";
import { useOptimisticToggleCount } from "@/hooks/useOptimisticToggleCount";

type Author = {
  id: string;
  userId: string;
  name: string;
  profileImage: string | null;
};

export type CommentItemData = {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  depth: number;
  replyCount: number;
  likeCount: number;
  isLiked: boolean;
  parentCommentId: string | null;
  isDeleted: boolean;
};

type Props = {
  comment: CommentItemData;
  postId: string;
  currentUserId?: string | null;
  isLoggedIn: boolean;
  onReply?: (commentId: string, userId: string) => void;
};

export default function CommentItem({
  comment,
  postId,
  currentUserId,
  isLoggedIn,
  onReply,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isOwner = !!currentUserId && currentUserId === comment.author.id;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  // useTransition: 서버 액션 실행 중 버튼 비활성화를 위해 사용
  const [isPending, startTransition] = useTransition();

  const {
    active: liked,
    count: likedCount,
    toggle: handleLike,
  } = useOptimisticToggleCount({
    initialActive: comment.isLiked,
    initialCount: comment.likeCount,
    canToggle: isLoggedIn,
    onBlocked: () => {
      toast.warning("로그인이 필요합니다.");
      //로그인 성공 후 다시 돌아올 위치를 login 페이지에 알려주는 주소
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    },

    onToggle: async () => {
      const result = await toggleCommentLikeAction({
        postId,
        commentId: comment.id,
      });
      if ("isError" in result) return result;
      return {
        active: result.liked,
        count: result.likeCount,
      };
    },
  });

  const doDelete = () => {
    startTransition(async () => {
      await deletePostCommentAction({ postId, commentId: comment.id });
      // 서버 컴포넌트(CommentsContent)를 재실행해 목록 갱신
      router.refresh();
    });
  };

  const handleDelete = () => {
    const hasReplies = comment.replyCount > 0;
    toast(
      hasReplies
        ? "대댓글도 함께 삭제됩니다. 삭제할까요?"
        : "댓글을 삭제할까요?",
      {
        action: { label: "삭제", onClick: doDelete },
        cancel: { label: "취소", onClick: () => {} },
      },
    );
  };

  const handleEditSubmit = () => {
    // 내용이 비어있거나 변경이 없으면 수정 없이 닫기
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }
    startTransition(async () => {
      await updatePostCommentAction({
        postId,
        commentId: comment.id,
        content: editContent.trim(),
      });
      setIsEditing(false);
      router.refresh();
    });
  };

  return (
    <div className="flex gap-3">
      <Avatar
        src={comment.author.profileImage}
        alt={comment.author.name}
        size="xs"
        className="mt-0.5 shrink-0"
      />

      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-near-black">
            {comment.author.userId}
          </span>
          <span className="text-xs text-silver">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-1">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              disabled={isPending}
              className="w-full resize-none rounded border border-linen px-2 py-1 text-sm text-near-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={handleEditSubmit}
                disabled={isPending}
                className="text-xs font-medium text-black disabled:opacity-50"
              >
                저장
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(false);
                }}
                disabled={isPending}
                className="text-xs text-cool-gray disabled:opacity-50"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-0.5 text-sm leading-relaxed text-near-black">
            {comment.content}
          </p>
        )}

        <div className="mt-1 flex items-center gap-3">
          {onReply && (
            <button
              type="button"
              onClick={() => onReply(comment.id, comment.author.userId)}
              className="text-sm text-cool-gray hover:text-near-black"
            >
              답글 달기
            </button>
          )}
          {isOwner && !isEditing && (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-sm text-cool-gray hover:text-near-black"
              >
                수정
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="text-sm text-cool-gray hover:text-red-500 disabled:opacity-50"
              >
                삭제
              </button>
            </>
          )}

          {/* 좋아요 버튼: 로그인 사용자만 누를 수 있고, 비로그인은 카운트만 표시 */}
          <div className="ml-auto flex items-center gap-1">
            {currentUserId ? (
              <button
                type="button"
                onClick={handleLike}
                disabled={isPending}
                className="flex items-center gap-1 disabled:opacity-50"
              >
                <Heart
                  size={14}
                  className={liked ? "fill-rust text-rust" : "text-silver"}
                />
                {likedCount > 0 && (
                  <span
                    className={`text-xs ${liked ? "text-rust" : "text-silver"}`}
                  >
                    {likedCount}
                  </span>
                )}
              </button>
            ) : (
              likedCount > 0 && (
                <span className="flex items-center gap-1 text-xs text-silver">
                  <Heart size={14} />
                  {likedCount}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
