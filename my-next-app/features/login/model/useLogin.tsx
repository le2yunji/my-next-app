"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  isValidEmail,
  isValidId,
  isValidPassword,
  isValidPhone,
} from "@/features/auth/validation/validators";

import { AUTH_ERROR_MESSAGES } from "@/features/auth/constants/errorMessages";
import type { LoginForm } from "@/features/login/model/type";
import { loginApi } from "@/features/login/api/login";
import { useAuthStore } from "@/entities/session/client";

export default function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const redirect = searchParams.get("redirect") ?? "/";

  const [fieldErrors, setFieldErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const [form, setForm] = useState<LoginForm>({
    identifier: "",
    password: "",
  });

  const onChangeField = (name: keyof LoginForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    if (loading) return;

    setError(null);
    setFieldErrors({});

    const errors: { identifier?: string; password?: string } = {};

    if (
      !isValidId(form.identifier) &&
      !isValidEmail(form.identifier) &&
      !isValidPhone(form.identifier)
    )
      errors.identifier = AUTH_ERROR_MESSAGES.identifier;

    if (!isValidPassword(form.password))
      errors.password = AUTH_ERROR_MESSAGES.password;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const result = await loginApi(form.identifier, form.password);

      if (result?.isError) {
        setError(result.message ?? "로그인 실패");
        return;
      }

      // 로그인 응답에 포함된 user로 즉시 store 업데이트 (새로고침 없이 사이드바 반영)
      if (result.user) setUser(result.user);
      router.replace(redirect);
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    onChangeField,
    onSubmit,
    loading,
    error,
    fieldErrors,
  };
}
