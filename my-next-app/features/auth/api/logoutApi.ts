import apiClient from "@/shared/api/api-client";

export const logoutApi = async (): Promise<void> => {
  await apiClient.post("/api/auth/logout", {}, { credentials: "include" });
};
