// lib/auth/get-me-server.ts
import "server-only";
import { cookies } from "next/headers";
import apiClient from "@/app/utils/api-client";

export const getMeServer = async () => {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll() // 요청에 들어온 쿠키들을 배열로 가져오기
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const res = await apiClient.get(`/api/auth/me`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  console.log("cookieHeader: ", cookieHeader);

  const data = await res.json();

  if (!res.ok) {
    return null;
  }

  return data.user;
};
