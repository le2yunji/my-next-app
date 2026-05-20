"use server";

import apiClient from "@/shared/api/api-client";
import { getServerAuthHeaders } from "@/shared/lib/server/auth-headers";
import type { UploadContext } from "@/shared/lib/upload/image-upload.constants";

export type PresignedUrlResult = {
  presignedUrl: string; // 실제 파일 업로드에 사용할 임시 URL
  key: string; // 스토리지 내부 파일 경로 또는 파일 키
  publicUrl: string; // 업로드 후 접근 가능한 공개 URL
};

export async function getPresignedUrlsAction(
  context: UploadContext,
  files: { mimeType: string; size: number }[], // 파일의 MIME 타입과 크기만 서버에 전달
): Promise<
  | { isError: true; message: string }
  | { isError: false; data: PresignedUrlResult[] }
> {
  let res: Response;
  try {
    const headers = await getServerAuthHeaders();
    res = await apiClient.post(
      "/api/upload/presigned",
      { context, files },
      { headers },
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
