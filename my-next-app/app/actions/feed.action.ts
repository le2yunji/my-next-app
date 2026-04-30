"use server";
import { cookies } from "next/headers";
import apiClient from "@/app/utils/api-client";

export const getFeedAction = async (params: {
  limit?: number;
  cursor?: string | null;
}) => {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.cursor) qs.set("cursor", params.cursor);

  // credentials: "include"는 브라우저 전용 — 서버에서는 Cookie 헤더로 직접 전달
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  console.log(
    "[getFeedAction] cookie 전달 여부:",
    cookieHeader ? "있음" : "없음(비로그인)",
  );

  const url = `/api/feed?${qs.toString()}`;
  let res: Response;
  try {
    res = await apiClient.get(url, {
      cache: "no-store",
      headers: { Cookie: cookieHeader },
    });
  } catch {
    return { isError: true, message: "네트워크 오류가 발생했습니다." };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }

  if (!res.ok) {
    return {
      isError: true,
      message:
        data?.message ?? `피드를 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  console.log(
    "[getFeedAction] isLiked 샘플:",
    data?.items?.slice(0, 2).map((i: { id: string; isLiked: boolean }) => ({
      id: i.id,
      isLiked: i.isLiked,
    })),
  );
  return data;
};
