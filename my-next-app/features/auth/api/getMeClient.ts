import apiClient from "@/app/utils/api-client";

export const getMeClient = async () => {
  try {
    const res = await apiClient.get("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
};
