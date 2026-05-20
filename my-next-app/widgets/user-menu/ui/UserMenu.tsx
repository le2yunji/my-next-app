"use client";
import { FlyOut } from "@/shared/ui/flyout";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/entities/session/client";
import { logoutApi } from "@/features/auth/api/logoutApi";
import SidebarUserAvatar from "@/widgets/sidebar/SidebarUserAvatar";

export function UserMenu() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const handleProfileClick = () => {
    router.push(`/users/${user.userId}`);
  };

  const handleLogoutClick = async () => {
    await logoutApi();

    router.replace("/login");
    router.refresh();
  };

  return (
    <FlyOut className="w-full">
      <FlyOut.Toggle
        className="
          flex w-full items-center rounded-lg px-4 py-3
          transition-colors hover:bg-linen
          md:justify-center md:px-2
          lg:justify-start lg:px-4
        "
      >
        <SidebarUserAvatar />
      </FlyOut.Toggle>

      <FlyOut.List className="left-45 bottom-5 mt-2 w-36 z-[9999]">
        <FlyOut.Item onClick={handleProfileClick}>내 프로필</FlyOut.Item>

        <FlyOut.Item onClick={handleLogoutClick}>로그아웃</FlyOut.Item>
      </FlyOut.List>
    </FlyOut>
  );
}
