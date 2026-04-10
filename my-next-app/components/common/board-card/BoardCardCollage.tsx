import Image from "next/image";
import { BoardPreviewImage } from "@/types/board";
import { BoardCardSize } from "./board-card.type";

function PreviewCell({
  image,
  alt,
  className,
  sizes,
}: {
  image?: BoardPreviewImage;
  alt: string;
  className: string;
  sizes: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#F3F4F6] ${className}`}>
      {image ? (
        <Image
          src={image.url}
          alt={alt}
          fill
          unoptimized
          className="object-cover"
          sizes={sizes}
        />
      ) : null}
    </div>
  );
}

function getSingleAspect(size: BoardCardSize) {
  if (size === "lg") return "aspect-[1.5/1]";
  if (size === "md") return "aspect-[1.35/1]";
  return "aspect-[1.2/1]";
}

function getDoubleAspect(size: BoardCardSize) {
  if (size === "lg") return "aspect-[1.5/1]";
  if (size === "md") return "aspect-[1.35/1]";
  return "aspect-[1.2/1]";
}

export default function BoardCardCollage({
  images,
  size,
  title,
}: {
  images: BoardPreviewImage[];
  size: BoardCardSize;
  title: string;
}) {
  const [first, second, third] = images;
  const imageCount = images.length;

  if (imageCount <= 0) {
    return (
      <div
        className={`overflow-hidden rounded-[22px] bg-[#F3F4F6] ${getSingleAspect(
          size
        )}`}
      />
    );
  }

  // 1장: 1분할
  if (imageCount === 1) {
    return (
      <div className="overflow-hidden rounded-[22px]">
        <PreviewCell
          image={first}
          alt={title}
          className={getSingleAspect(size)}
          sizes="(max-width: 768px) 100vw, 420px"
        />
      </div>
    );
  }

  // 2장: 2분할
  if (imageCount === 2) {
    return (
      <div className="overflow-hidden rounded-[22px]">
        <div className={`grid grid-cols-2 gap-[2px] ${getDoubleAspect(size)}`}>
          <PreviewCell
            image={first}
            alt={`${title} preview 1`}
            className="h-full w-full"
            sizes="(max-width: 768px) 50vw, 210px"
          />
          <PreviewCell
            image={second}
            alt={`${title} preview 2`}
            className="h-full w-full"
            sizes="(max-width: 768px) 50vw, 210px"
          />
        </div>
      </div>
    );
  }

  // 3장 이상: 사이즈별 3분할
  if (size === "lg") {
    return (
      <div className="grid grid-cols-[1.15fr_1fr] gap-[2px] overflow-hidden rounded-[24px]">
        <PreviewCell
          image={first}
          alt={title}
          className="min-h-[220px]"
          sizes="(max-width: 768px) 60vw, 260px"
        />

        <div className="grid grid-rows-2 gap-[2px]">
          <PreviewCell
            image={second}
            alt={`${title} preview 2`}
            className="min-h-[109px]"
            sizes="(max-width: 768px) 40vw, 160px"
          />
          <PreviewCell
            image={third}
            alt={`${title} preview 3`}
            className="min-h-[109px]"
            sizes="(max-width: 768px) 40vw, 160px"
          />
        </div>
      </div>
    );
  }

  if (size === "sm") {
    return (
      <div className="overflow-hidden rounded-[20px]">
        <PreviewCell
          image={first}
          alt={title}
          className="aspect-[1.15/1] w-full"
          sizes="(max-width: 768px) 100vw, 260px"
        />

        <div className="mt-[2px] grid grid-cols-2 gap-[2px]">
          <PreviewCell
            image={second}
            alt={`${title} preview 2`}
            className="aspect-square w-full"
            sizes="(max-width: 768px) 50vw, 120px"
          />
          <PreviewCell
            image={third}
            alt={`${title} preview 3`}
            className="aspect-square w-full"
            sizes="(max-width: 768px) 50vw, 120px"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[22px]">
      <PreviewCell
        image={first}
        alt={title}
        className="aspect-[1.4/1] w-full"
        sizes="(max-width: 768px) 100vw, 320px"
      />

      <div className="mt-[2px] grid grid-cols-2 gap-[2px]">
        <PreviewCell
          image={second}
          alt={`${title} preview 2`}
          className="aspect-[1.1/1] w-full"
          sizes="(max-width: 768px) 50vw, 150px"
        />
        <PreviewCell
          image={third}
          alt={`${title} preview 3`}
          className="aspect-[1.1/1] w-full"
          sizes="(max-width: 768px) 50vw, 150px"
        />
      </div>
    </div>
  );
}
