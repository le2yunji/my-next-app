"use client";

import Link from "next/link";
import Image from "next/image";
import { FeedItemModel } from "../../model/types";

export default function FeedItemHeader({
  author,
}: {
  author: FeedItemModel["author"];
}) {
  if (!author) return null;
  const profileSrc = `${author.profileImage}`;

  return (
    <Link href={`/users/${author.userId}`} scroll={false}>
      <div className="flex items-center">
        <div className="relative w-7 h-7 overflow-hidden rounded-full mr-2">
          <Image
            src={profileSrc}
            alt={`${author.userId}의 프로필 사진`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <span>{author.userId}</span>
      </div>
    </Link>
  );
}
