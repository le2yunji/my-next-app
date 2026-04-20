"use client";

import Link from "next/link";
import type { FeedAuthor } from "@/features/feed/types/feed.type";
import Avatar from "@/components/common/Avatar";

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

export default function FeedItemHeader({
  author,
  createdAt,
}: {
  author: FeedAuthor;
  createdAt: string;
}) {
  if (!author) return null;

  return (
    <div className="flex items-center justify-between">
      <Link href={`/users/${author.userId}`} scroll={false}>
        <div className="flex items-center gap-2">
          <Avatar
            src={author.profileImage}
            alt={`${author.userId}의 프로필 사진`}
            size="xs"
          />
          <span className="text-sm font-semibold">{author.userId}</span>
        </div>
      </Link>
      <span className="text-[13px] text-cool-gray/90">
        {formatRelativeTime(createdAt)}
      </span>
    </div>
  );
}
