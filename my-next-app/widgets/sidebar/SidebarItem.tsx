"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  Search,
  Bell,
  Bookmark,
  User,
  Settings,
  LucideIcon,
} from "lucide-react";
import { IconKey } from "./sidebarConfig";
import { useAuthStore } from "@/entities/session/client";
import { toast } from "sonner";

// IconKey 문자열을 실제 Lucide 컴포넌트로 변환하는 맵
const iconMap: Record<IconKey, LucideIcon> = {
  House,
  Search,
  Bell,
  Bookmark,
  User,
  Settings,
};

type Props = {
  href: string;
  label: string;
  icon: IconKey;
  variant?: "sidebar" | "bottom";
  authRequired?: boolean;
  badge?: number;
};

export default function SidebarItem({
  href,
  label,
  icon,
  variant = "sidebar",
  authRequired = false,
  badge,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  // 프로필 링크는 로그인한 유저의 실제 userId로 교체
  const resolvedHref = authRequired && user ? `/users/${user.userId}` : href;
  // 프로필 탭은 동적 경로이므로 별도 비교, 나머지는 href 직접 비교
  const isActive = authRequired
    ? pathname === `/users/${user?.userId}`
    : pathname === href;
  const Icon = iconMap[icon];

  const handleAuthClick = (e: React.MouseEvent) => {
    if (!authRequired) return;
    // 아직 인증 상태를 모르는 경우 네비게이션 보류
    if (isLoading) {
      e.preventDefault();
      return;
    }
    if (!user) {
      e.preventDefault();
      toast("로그인이 필요합니다");
      router.push("/login");
    }
  };

  const showBadge = !!badge && badge > 0;

  if (variant === "bottom") {
    return (
      <Link
        href={resolvedHref}
        onClick={handleAuthClick}
        className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
          isActive ? "text-black" : "text-gray-400"
        }`}
      >
        <Icon size={26} strokeWidth={isActive ? 2 : 1.6} />
        {showBadge && (
          <span className="absolute top-1.5 right-1/4 flex h-4 min-w-4 items-center justify-center rounded-full bg-rust px-0.5 text-[10px] font-bold text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={resolvedHref}
      onClick={handleAuthClick}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors md:justify-center md:px-2 lg:justify-start lg:px-4 ${
        isActive ? "bg-black text-white" : "text-gray-600 hover:bg-linen"
      }`}
    >
      <span className="relative">
        <Icon
          size={22}
          strokeWidth={1.6}
          className={isActive ? "text-white" : ""}
        />
        {showBadge && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rust px-0.5 text-[10px] font-bold text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </span>
      <span
        className={`hidden lg:block text-[15px] font-medium ${isActive ? "text-white" : ""}`}
      >
        {label}
      </span>
    </Link>
  );
}
