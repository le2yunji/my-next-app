"use client";

import { useState } from "react";
import CommentItem, { type CommentItemData } from "./CommentItem";
import CommentInput from "./CommentInput";

type CommentThread = {
  comment: CommentItemData;
  replies: CommentItemData[];
};

type Props = {
  threads: CommentThread[];
  postId: string;
  currentUserProfileImage?: string | null;
};

export default function CommentList({
  threads,
  postId,
  currentUserProfileImage,
}: Props) {
  // 답글 대상: { commentId, userId } | null
  const [replyTarget, setReplyTarget] = useState<{
    commentId: string;
    userId: string;
  } | null>(null);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 댓글 목록 */}
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <p className="py-16 text-center text-sm text-silver">
            첫 댓글을 남겨보세요
          </p>
        ) : (
          <ul className="divide-y divide-linen">
            {threads.map(({ comment, replies }) => (
              <li key={comment.id} className="px-4 py-4">
                <CommentItem
                  comment={comment}
                  onReply={(commentId, userId) =>
                    setReplyTarget({ commentId, userId })
                  }
                />

                {/* 답글 목록 */}
                {replies.length > 0 && (
                  <ul className="ml-9 mt-3 space-y-3">
                    {replies.map((reply) => (
                      <li key={reply.id}>
                        <CommentItem comment={reply} />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 댓글 입력창 */}
      <CommentInput
        postId={postId}
        currentUserProfileImage={currentUserProfileImage}
        replyTarget={replyTarget}
        onCancelReply={() => setReplyTarget(null)}
      />
    </div>
  );
}
