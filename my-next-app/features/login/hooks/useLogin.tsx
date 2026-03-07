"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isValidId, isValidPassword } from "@/features/auth/model/validators";
import { loginAction } from "@/app/actions/login.action";
import { AUTH_ERROR_MESSAGES } from "@/features/auth/constants/errorMessages";

export type LoginForm = {
  id: string;
  password: string;
};

export default function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const [fieldErrors, setFieldErrors] = useState<{
    id?: string;
    password?: string;
  }>({});

  const [form, setForm] = useState<LoginForm>({
    id: "",
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

    const errors: { id?: string; password?: string } = {};

    if (!isValidId(form.id)) errors.id = AUTH_ERROR_MESSAGES.id;
    if (!isValidPassword(form.password))
      errors.password = AUTH_ERROR_MESSAGES.password;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const result = await loginAction(form.id, form.password);

      if (result?.isError) {
        setError(result.message ?? "로그인 실패");
        return;
      }

      router.push("/");
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
