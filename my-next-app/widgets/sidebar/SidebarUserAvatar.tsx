"use client";

import { useAuthStore } from "@/entities/session/client";
import Avatar from "@/shared/ui/Avatar";

export default function SidebarUserAvatar() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="flex w-full items-center gap-3 md:justify-center lg:justify-start">
      <Avatar src={null} alt={`${user.userId} 프로필`} size="xs" />

      <span className="hidden text-[15px] font-medium text-gray-700 lg:block">
        {user.userId}
      </span>
    </div>
  );
}
