"use client";

import Image from "next/image";

export default function FeedItemThumbnail({
  postId,
  thumbnail,
  priorityPost,
}: {
  postId: string;
  thumbnail: { type: "image" | "video"; url: string };
  priorityPost: boolean;
}) {
  return (
    <div className="relative mt-5 w-full aspect-square overflow-hidden rounded-lg">
      <Image
        src={thumbnail.url}
        alt={`${postId}의 썸네일`}
        fill
        className="object-cover"
        priority={priorityPost}
        unoptimized
      />
    </div>
  );
}
