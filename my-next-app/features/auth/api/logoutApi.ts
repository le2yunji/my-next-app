import apiClient from "@/app/utils/api-client";

export const logoutApi = async (): Promise<void> => {
  await apiClient.post("/api/auth/logout", {}, { credentials: "include" });
};
