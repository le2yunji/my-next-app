import apiClient from "@/app/utils/api-client";

export const getMeClient = async () => {
  const res = await apiClient.get("/api/auth/me", {
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401) {
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "사용자 정보를 불러오지 못했습니다.");
  }

  return data.user;
};
