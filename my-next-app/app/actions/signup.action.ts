"use server";

import { API_BASE_URL } from "../utils/api";

type SignupResult = {
  isError?: boolean;
  message?: string;
  id?: string;
  [key: string]: any; // 임시로 쓰는 코드
};

export const signupAction = async (
  id: string,
  password: string
): Promise<SignupResult> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = { isError: true, message: "서버 응답 형식이 올바르지 않습니다." };
  }

  if (!res.ok) {
    return {
      isError: true,
      message: data?.message ?? "회원가입 실패",
    };
  }

  return data;
};
