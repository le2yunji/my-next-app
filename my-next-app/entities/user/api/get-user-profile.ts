import apiClient from "@/shared/api/api-client";

export async function getUserProfile({ userId }: { userId: string }) {
  let res;
  try {
    res = await apiClient.get(`/api/users/${userId}/profile`, {
      next: { revalidate: 300 },
    });
  } catch {
    return {
      isError: true,
      message: "네트워크 오류가 발생했습니다.",
    };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return {
      isError: true,
      message: "서버 응답 형식이 올바르지 않습니다.",
    };
  }

  if (!res.ok) {
    return {
      isError: true,
      message:
        data?.message ??
        `유저 정보를 불러오는데 실패했습니다. (HTTP ${res.status})`,
      ...data,
    };
  }

  return {
    isError: false,
    data: data.profile,
  };
}
