"use client";

import { useEffect } from "react";
import { getMeClient } from "@/features/auth/api/getMe";
import { useAuthStore } from "@/stores/auth.store";

export default function AuthInitializer() {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getMeClient();

        if (user) {
          setUser(user);
        } else {
          clearUser();
        }
      } catch (error) {
        clearUser();
        console.error("getMeClient failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [setUser, setIsLoading, clearUser]);

  return null;
}
