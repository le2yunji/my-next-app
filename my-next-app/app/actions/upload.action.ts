"use server";

import { cookies } from "next/headers";
import apiClient from "@/app/utils/api-client";

export type PresignedUrlResult = {
  presignedUrl: string;
  key: string;
  publicUrl: string;
};

export async function getPresignedUrlsAction(
  files: { mimeType: string; size: number }[],
): Promise<
  | { isError: true; message: string }
  | { isError: false; data: PresignedUrlResult[] }
> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  let res: Response;
  try {
    res = await apiClient.post(
      "/api/upload/presigned",
      { context: "post", files },
      { headers: { Cookie: cookieHeader } },
    );
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
      message: data?.message ?? `업로드 URL 생성 실패 (HTTP ${res.status})`,
    };
  }

  return { isError: false, data: data.data };
}
