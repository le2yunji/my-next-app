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
  let data;
  try {
    data = await res.json();
  } catch {
    data = { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }

  if (!res.ok) {
    return {
      isError: true,
      message:
        data?.message ??
        `로그인에 실패했습니다. (HTTP 상태 코드: ${res.status})`,
      ...data,
    };
  }

  return data;
};
