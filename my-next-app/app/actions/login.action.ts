"use server";

import { API_BASE_URL } from "../utils/api";

type LoginResult = {
  isError?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: any;
};

export const loginAction = async (
  id: string,
  password: string
): Promise<LoginResult> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password }),
  });

  // 백엔드가 401/400 등을 주는 경우 대비
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = { isError: true, message: "Invalid JSON response" };
  }

  if (!res.ok) {
    return {
      isError: true,
      message: data?.message ?? `Login failed (${res.status})`,
      ...data,
    };
  }

  return data;
};
