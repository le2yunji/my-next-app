import Image from "next/image";
import { BoardPreviewImage, BoardSize } from "./board.type";

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
          loading="eager"
        />
      ) : null}
    </div>
  );
}

function getSingleAspect(_size: BoardSize) {
  return "aspect-square";
}

function getDoubleAspect(_size: BoardSize) {
  return "aspect-square";
}

export default function BoardCollage({
  images,
  size,
  title,
}: {
  images: BoardPreviewImage[];
  size: BoardSize;
  title: string;
}) {
  const [first, second, third] = images;
  const imageCount = images.length;

  if (imageCount <= 0) {
    return (
      <div
        className={`overflow-hidden rounded-[22px] bg-[#F3F4F6] ${getSingleAspect(
          size,
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
        <div className={`grid grid-cols-2 gap-0.5 ${getDoubleAspect(size)}`}>
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

  // 3장 이상: 사이즈별 3분할 (전체 컨테이너 aspect-square)
  if (size === "lg") {
    return (
      <div className="aspect-square overflow-hidden rounded-3xl grid grid-cols-[1.15fr_1fr] gap-0.5">
        <PreviewCell
          image={first}
          alt={title}
          className="h-full w-full"
          sizes="(max-width: 768px) 60vw, 260px"
        />

        <div className="grid grid-rows-2 gap-0.5">
          <PreviewCell
            image={second}
            alt={`${title} preview 2`}
            className="h-full w-full"
            sizes="(max-width: 768px) 40vw, 160px"
          />
          <PreviewCell
            image={third}
            alt={`${title} preview 3`}
            className="h-full w-full"
            sizes="(max-width: 768px) 40vw, 160px"
          />
        </div>
      </div>
    );
  }

  if (size === "sm") {
    return (
      <div className="aspect-square overflow-hidden rounded-[20px] grid grid-rows-[1.5fr_1fr] gap-0.5">
        <PreviewCell
          image={first}
          alt={title}
          className="h-full w-full"
          sizes="(max-width: 768px) 100vw, 260px"
        />

        <div className="grid grid-cols-2 gap-0.5">
          <PreviewCell
            image={second}
            alt={`${title} preview 2`}
            className="h-full w-full"
            sizes="(max-width: 768px) 50vw, 120px"
          />
          <PreviewCell
            image={third}
            alt={`${title} preview 3`}
            className="h-full w-full"
            sizes="(max-width: 768px) 50vw, 120px"
          />
        </div>
      </div>
    );
  }

  // md
  return (
    <div className="aspect-square overflow-hidden rounded-[22px] grid grid-rows-[1.5fr_1fr] gap-0.5">
      <PreviewCell
        image={first}
        alt={title}
        className="h-full w-full"
        sizes="(max-width: 768px) 100vw, 320px"
      />

      <div className="grid grid-cols-2 gap-0.5">
        <PreviewCell
          image={second}
          alt={`${title} preview 2`}
          className="h-full w-full"
          sizes="(max-width: 768px) 50vw, 150px"
        />
        <PreviewCell
          image={third}
          alt={`${title} preview 3`}
          className="h-full w-full"
          sizes="(max-width: 768px) 50vw, 150px"
        />
      </div>
    </div>
  );
}
