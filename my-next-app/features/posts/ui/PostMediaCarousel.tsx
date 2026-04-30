"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { PostMediaDto } from "@/features/home/dto/post.dto";

export default function PostMediaCarousel({
  postId,
  media,
  className,
}: {
  postId: string;
  media: PostMediaDto[];
  /** 최외곽 래퍼에 적용할 클래스. 미지정 시 PostDetail용 mx-5 기본값 */
  className?: string;
}) {
  // 단일 이미지는 캐러셀 없이 렌더링
  if (media.length === 1) {
    return (
      <div
        className={`relative aspect-square overflow-hidden bg-[#ECE7E1] ${className ?? "mx-5"}`}
      >
        <Image
          src={media[0].url}
          alt={`${postId}의 사진`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-black/4" />
      </div>
    );
  }

  return <Carousel postId={postId} media={media} className={className} />;
}

function Carousel({
  postId,
  media,
  className,
}: {
  postId: string;
  media: PostMediaDto[];
  className?: string;
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

  const goTo = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * index, behavior: "smooth" });
  };

  return (
    <div className={`relative overflow-hidden ${className ?? "mx-5"}`}>
      {/* 스와이프 영역 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-hide"
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
              priority={idx === 0}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* 이전 버튼 */}
      {currentIndex > 0 && (
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          aria-label="이전 사진"
          className="absolute top-1/2 left-4 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* 다음 버튼 */}
      {currentIndex < media.length - 1 && (
        <button
          type="button"
          onClick={() => goTo(currentIndex + 1)}
          aria-label="다음 사진"
          className="absolute top-1/2 right-3 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* 인덱스 배지 (우상단) */}
      <div className="absolute top-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
        {currentIndex + 1} / {media.length}
      </div>

      {/* 페이지 인디케이터 (하단 점) */}
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

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/4" />
    </div>
  );
}
