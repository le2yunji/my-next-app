"use client";

import Image from "next/image";

export default function FeedThumbnail({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  if (!src) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-[18px] bg-[#ECE7E1]" />
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[18px] bg-[#F3F4F6]">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="object-cover transition duration-300 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 30vw, 180px"
      />

      {/* 사진 느낌 살리려고 하단에 아주 약한 그라데이션만 깔아둠 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/10 to-transparent" />

      {/* 테두리 대신 아주 약한 안쪽 라인 */}
      <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-black/4" />
    </div>
  );
}
