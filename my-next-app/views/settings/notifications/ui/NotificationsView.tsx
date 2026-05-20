"use client";

import { SecondaryButton } from "@/shared/ui/button/SecondaryButton";
import useLogout from "@/features/auth/hooks/useLogout";
import { UpdateNotificationSettings } from "@/features/update-notification-settings";

export default function NotificationsView() {
  const { logout, loading } = useLogout();
  return (
    <div className="mx-auto max-w-lg px-5 py-8">
      <UpdateNotificationSettings />
      <div className="mt-8">
        <SecondaryButton onClick={logout} disabled={loading}>
          로그아웃
        </SecondaryButton>
      </div>
    </div>
  );
}
