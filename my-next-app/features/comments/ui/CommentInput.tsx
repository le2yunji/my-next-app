"use client";

import { useRef, useState, useTransition } from "react";
import { Send } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { createPostCommentAction } from "@/app/actions/comments.action";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  currentUserProfileImage?: string | null;
  replyTarget?: { commentId: string; userId: string } | null;
  onCancelReply?: () => void;
};

export default function CommentInput({
  postId,
  currentUserProfileImage,
  replyTarget,
  onCancelReply,
}: Props) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const handleSubmit = () => {
    // 중복 제출 방지
    const trimmed = content.trim();
    if (!trimmed || isPending) return;

    startTransition(async () => {
      await createPostCommentAction({
        postId,
        content: trimmed,
        parentCommentId: replyTarget?.commentId ?? null,
      });
      setContent("");
      onCancelReply?.();
      router.refresh();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter는 줄바꿈, Enter만 누르면 제출
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-linen bg-white px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
      {/* 답글 대상 표시 */}
      {replyTarget && (
        <div className="mb-2 flex items-center justify-between rounded-md bg-linen px-3 py-1.5">
          <span className="text-xs text-cool-gray">
            <span className="font-semibold text-near-black">
              @{replyTarget.userId}
            </span>
            에게 답글 작성 중
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            className="text-xs text-cool-gray hover:text-near-black"
          >
            취소
          </button>
        </div>
      )}

      <div className="flex items-end gap-3">
        <Avatar
          src={currentUserProfileImage}
          alt="내 프로필"
          size="xs"
          className="mb-0.5 shrink-0"
        />

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="댓글을 입력하세요..."
          rows={1}
          className="max-h-28 flex-1 resize-none overflow-y-auto rounded-2xl bg-linen px-4 py-2.5 text-sm text-near-black outline-none placeholder:text-silver"
          style={{ lineHeight: "1.5" }}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || isPending}
          className="mb-0.5 shrink-0 text-rust transition-opacity disabled:opacity-30"
          aria-label="댓글 등록"
        >
          <Send size={20} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
