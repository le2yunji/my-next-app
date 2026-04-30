"use client";

import { SecondaryButton } from "@/components/common/button/SecondaryButton";
import useLogout from "@/features/auth/hooks/useLogout";
import NotificationSettings from "./NotificationSettings";

export default function SettingsView() {
  const { logout, loading } = useLogout();
  return (
    <div className="mx-auto max-w-lg px-5 py-8">
      <h1 className="mb-6 text-xl font-bold">설정</h1>
      <NotificationSettings />
      <div className="mt-8">
        <SecondaryButton onClick={logout} disabled={loading}>
          로그아웃
        </SecondaryButton>
      </div>
    </div>
  );
}
