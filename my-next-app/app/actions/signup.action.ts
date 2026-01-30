"use server";

import { API_BASE_URL } from "../utils/api";

type SignupResult = {
  isError?: boolean;
  message?: string;
  id?: string;
  [key: string]: any;
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
    cache: "no-store",
  });

  let data;
  try {
    data = await res.json();
  } catch {
    return { isError: true, message: "Invalid server response" };
  }

  if (!res.ok) {
    return {
      isError: true,
      message: data?.message ?? "Signup failed",
    };
  }

  return data;
};
