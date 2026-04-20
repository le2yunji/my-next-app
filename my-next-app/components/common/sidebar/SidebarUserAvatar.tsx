"use client";

import Link from "next/link";
import Avatar from "@/components/common/Avatar";
import { useAuthStore } from "@/stores/auth.store";

export default function SidebarUserAvatar() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return (
    <Link
      href="/profile"
      className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-linen md:justify-center md:px-2 lg:justify-start lg:px-4"
    >
      <Avatar src={null} alt={`${user.userId} 프로필`} size="xs" />
      <span className="hidden text-[15px] font-medium text-gray-700 lg:block">
        {user.userId}
      </span>
    </Link>
  );
}
