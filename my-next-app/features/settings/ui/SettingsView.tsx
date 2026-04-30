"use client";

import { SecondaryButton } from "@/components/common/button/SecondaryButton";
import useLogout from "@/features/auth/hooks/useLogout";

export default function SettingsView() {
  const { logout, loading } = useLogout();
  return (
    <div>
      <SecondaryButton onClick={logout} disabled={loading}>
        로그아웃
      </SecondaryButton>
    </div>
  );
}
