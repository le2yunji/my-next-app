"use server";

import apiClient from "@/app/utils/api-client";

type SignupResult = {
  isError?: boolean;
  message?: string;
  userId?: string;
};

export const signupAction = async (
  name: string,
  email: string,
  phone: string,
  userId: string,
  password: string,
  passwordConfirm: string,
  interestCategories: string[],
  customInterestCategories: string[],
): Promise<SignupResult> => {
  let res: Response;
  try {
    res = await apiClient.post("/api/auth/signup", {
      name,
      email,
      phone,
      userId,
      password,
      passwordConfirm,
      interestCategories,
      customInterestCategories,
    });
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
      message: data?.message ?? "회원가입 실패",
    };
  }

  return data;
};
