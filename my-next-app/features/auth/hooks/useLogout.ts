"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { logoutApi } from "@/features/auth/api/logoutApi";
import { useAuthStore } from "@/stores/auth.store";

export default function useLogout() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await logoutApi();
      clearUser();
      toast("로그아웃 되었습니다.");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
