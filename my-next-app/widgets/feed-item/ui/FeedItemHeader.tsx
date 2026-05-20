"use client";

import Link from "next/link";
import type { FeedAuthor } from "@/features/home/types/feed.type";
import Avatar from "@/shared/ui/Avatar";
import { formatRelativeTime } from "@/features/comments/utils/formatRelativeTime";

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
