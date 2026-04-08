import Image from "next/image";

export default function FeedThumbnail({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  if (!src) {
    return <div className="aspect-square w-full rounded-[20px] bg-[#ECE7E1]" />;
  }
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#F3F4F6]">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="object-cover"
        sizes="(max-width: 768px) 30vw, 180px"
      />
    </div>
  );
}
