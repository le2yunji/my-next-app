// features/lib/auth/getMeServer.ts
// 서버 컴포넌트 / 서버 액션 / 서버 사이드 로직에서 현재 로그인 유저를 확인할 때
import "server-only";

import apiClient from "@/shared/api/api-client";
import { GetMeResponse } from "../model/types";
import { getServerAuthHeaders } from "@/shared/lib/server/auth-headers";

export const getMeServer = async () => {
  try {
    const headers = await getServerAuthHeaders();
    const res = await apiClient.get(`/api/auth/me`, {
      headers,
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as GetMeResponse;
    return data.user ?? null;
  } catch {
    return null;
  }
};
