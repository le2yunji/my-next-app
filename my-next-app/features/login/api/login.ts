import apiClient from "@/shared/api/api-client";

type LoginResult = {
  isError?: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    _id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
  };
};

export const loginApi = async (
  identifier: string,
  password: string,
): Promise<LoginResult> => {
  const res = await apiClient.post(
    "/api/auth/login",
    { identifier, password },
    {
      credentials: "include",
    },
  );
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
