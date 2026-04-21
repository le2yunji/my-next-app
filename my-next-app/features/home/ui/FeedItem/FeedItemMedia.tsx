"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { shouldPriorityMedia } from "@/features/home/lib/feedImagePolicy";
import type { PostMediaDto } from "@/features/home/dto/post.dto";

export default function FeedItemMedia({
  postId,
  media,
  priorityPost,
}: {
  postId: string;
  media: PostMediaDto[];
  priorityPost: boolean;
}) {
  // 단일 이미지는 캐러셀 없이 렌더링
  if (media.length === 1) {
    return (
      <div className="relative mt-5 w-full aspect-square overflow-hidden rounded-lg">
        <Image
          src={media[0].url}
          alt={`${postId}의 사진`}
          fill
          className="object-cover"
          priority={shouldPriorityMedia(priorityPost, 0)}
          unoptimized
        />
      </div>
    );
  }

  return (
    <MediaCarousel postId={postId} media={media} priorityPost={priorityPost} />
  );
}

function MediaCarousel({
  postId,
  media,
  priorityPost,
}: {
  postId: string;
  media: PostMediaDto[];
  priorityPost: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 스크롤 위치를 기반으로 현재 인덱스 계산
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentIndex(index);
  };

  return (
    <div className="relative mt-5">
      {/* 스와이프 영역 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory overflow-x-auto rounded-lg scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {media.map((m, idx) => (
          <div
            key={`${postId}-${idx}`}
            className="relative aspect-square w-full shrink-0 snap-start overflow-hidden"
          >
            <Image
              src={m.url}
              alt={`${postId}의 사진 ${idx + 1}`}
              fill
              className="object-cover"
              priority={shouldPriorityMedia(priorityPost, idx)}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* 페이지 인디케이터 */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {media.map((_, idx) => (
          <span
            key={idx}
            className={`block h-1.5 rounded-full transition-all duration-200 ${
              idx === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
