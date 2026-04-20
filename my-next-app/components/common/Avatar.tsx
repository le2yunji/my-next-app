import Image from "next/image";
import { User } from "lucide-react";
import { twMerge } from "tailwind-merge";

const sizeMap = {
  xxs: { container: "h-7 w-7", icon: 14 },
  xs: { container: "h-8 w-8", icon: 14 },
  sm: { container: "h-9 w-9", icon: 16 },
  md: { container: "h-12 w-12", icon: 20 },
  lg: { container: "h-16 w-16", icon: 24 },
  xl: { container: "h-20 w-20", icon: 30 },
  xxl: { container: "h-28 w-28", icon: 40 },
} as const;

type AvatarSize = keyof typeof sizeMap;

type Props = {
  src?: string | null;
  alt: string;
  size?: AvatarSize;
  className?: string;
};

export default function Avatar({
  src,
  alt,
  size = "md",
  className = "",
}: Props) {
  const { container, icon } = sizeMap[size];

  return (
    <div
      className={twMerge(
        "relative shrink-0 overflow-hidden rounded-full bg-light-gray",
        container,
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" unoptimized />
      ) : (
        // 이미지 없을 때 기본 아이콘 폴백
        <div className="flex h-full w-full items-center justify-center text-silver">
          <User size={icon} strokeWidth={1.6} />
        </div>
      )}
    </div>
  );
}
