"use client";

import { useState } from "react";
import Link from "next/link";
import CommentItem, { type CommentItemData } from "./CommentItem";
import CommentInput from "./CommentInput";

function LoginPrompt() {
  return (
    <div className="sticky bottom-0 border-t border-linen bg-white px-4 py-4 text-center">
      <Link
        href="/login"
        className="text-sm font-medium text-rust hover:underline"
      >
        로그인 후 댓글을 작성할 수 있어요
      </Link>
    </div>
  );
}

type CommentThread = {
  comment: CommentItemData;
  replies: CommentItemData[];
};

type Props = {
  threads: CommentThread[];
  postId: string;
  currentUserId?: string | null;
  currentUserProfileImage?: string | null;
  isLoggedIn: boolean;
};

export default function CommentList({
  threads,
  postId,
  currentUserId,
  currentUserProfileImage,
  isLoggedIn,
}: Props) {
  // 답글 대상: { commentId, userId } | null
  const [replyTarget, setReplyTarget] = useState<{
    commentId: string;
    userId: string;
  } | null>(null);

  return (
    <div className="flex flex-col">
      {/* 댓글 목록 */}
      <div>
        {threads.length === 0 ? (
          <p className="py-16 text-center text-sm text-silver">
            첫 댓글을 남겨보세요
          </p>
        ) : (
          <ul className="divide-y divide-linen">
            {threads
              .filter(({ comment }) => !comment.isDeleted)
              .map(({ comment, replies }) => (
                <li key={comment.id} className="px-4 py-4">
                  <CommentItem
                    comment={comment}
                    postId={postId}
                    currentUserId={currentUserId}
                    onReply={(commentId, userId) =>
                      setReplyTarget({ commentId, userId })
                    }
                  />

                  {/* 답글 목록 */}
                  {replies.filter((r) => !r.isDeleted).length > 0 && (
                    <ul className="ml-9 mt-3 space-y-3">
                      {replies
                        .filter((r) => !r.isDeleted)
                        .map((reply) => (
                          <li key={reply.id}>
                            <CommentItem
                              comment={reply}
                              postId={postId}
                              currentUserId={currentUserId}
                            />
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
      {isLoggedIn ? (
        <CommentInput
          postId={postId}
          currentUserProfileImage={currentUserProfileImage}
          replyTarget={replyTarget}
          onCancelReply={() => setReplyTarget(null)}
        />
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
}
