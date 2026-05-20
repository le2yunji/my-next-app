// features/auth/api/getMeClient.ts
// 브라우저 클라이언트에서 현재 로그인 유저를 확인할 때
import apiClient from "@/shared/api/api-client";
import type { GetMeResponse } from "../model/types";

export const getMeClient = async () => {
  try {
    const res = await apiClient.get("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as GetMeResponse;
    return data.user ?? null;
  } catch (error) {
    console.error("getMeClient error:", error);
    return null;
  }
};
