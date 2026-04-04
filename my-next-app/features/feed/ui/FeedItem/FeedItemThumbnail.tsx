"use client";

import Image from "next/image";

export default function FeedItemThumbnail({
  postId,
  thumbnail,
  priorityPost,
}: {
  postId: string;
  thumbnail: { type: "image"; url: string };
  priorityPost: boolean;
}) {
  return (
    <div className="relative mt-5 w-full aspect-393/320 overflow-hidden rounded-lg">
      <Image
        src={thumbnail.url}
        alt=""
        fill
        className="object-cover"
        priority={priorityPost}
        unoptimized
      />
    </div>
  );
}
