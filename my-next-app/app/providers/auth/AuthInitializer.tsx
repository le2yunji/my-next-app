"use client";

import { useEffect } from "react";
import { getMeClient } from "@/entities/session/api/getMeClient";
import { useAuthStore } from "@/entities/session/model/auth.store";

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
