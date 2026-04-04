"use client";

import Image from "next/image";
import { shouldPriorityMedia } from "@/features/feed/lib/feedImagePolicy";
import { FeedItemModel } from "../../model/types";

export default function FeedItemMedia({
  postId,
  media,
  priorityPost,
}: {
  postId: string;
  media: NonNullable<FeedItemModel["media"]>;
  priorityPost: boolean;
}) {
  return (
    <div className="grid">
      {media.map((m, idx) => (
        <div
          key={`${postId}-${idx}`}
          className="relative mt-5 w-full aspect-[393/320] overflow-hidden"
        >
          <Image
            src={m.url}
            alt=""
            fill
            className="object-cover"
            priority={shouldPriorityMedia(priorityPost, idx)}
          />
        </div>
      ))}
    </div>
  );
}
