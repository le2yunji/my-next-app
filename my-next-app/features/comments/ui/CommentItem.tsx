"use client";

import Avatar from "@/components/common/Avatar";
import { formatRelativeTime } from "@/features/comments/utils/formatRelativeTime";

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
  parentCommentId: string | null;
  isDeleted: boolean;
};

type Props = {
  comment: CommentItemData;
  onReply?: (commentId: string, userId: string) => void;
};

export default function CommentItem({ comment, onReply }: Props) {
  const isDeleted = comment.isDeleted;

  return (
    <div className="flex gap-3">
      <Avatar
        src={isDeleted ? null : comment.author.profileImage}
        alt={isDeleted ? "삭제된 사용자" : comment.author.name}
        size="xs"
        className="mt-0.5 shrink-0"
      />

      <div className="flex-1">
        {isDeleted ? (
          <p className="text-sm text-silver">삭제된 댓글입니다.</p>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-near-black">
                @{comment.author.userId}
              </span>
              <span className="text-xs text-silver">
                {formatRelativeTime(comment.createdAt)}
              </span>
            </div>

            <p className="mt-0.5 text-sm leading-relaxed text-near-black">
              {comment.content}
            </p>

            {onReply && (
              <button
                type="button"
                onClick={() => onReply(comment.id, comment.author.userId)}
                className="mt-1 text-xs text-cool-gray hover:text-near-black"
              >
                답글 달기
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
