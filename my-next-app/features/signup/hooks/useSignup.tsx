"use client";

import { useState } from "react";

import {
  isValidId,
  isValidPassword,
  isPasswordMatch,
} from "@/features/auth/model/validators";
import { signupAction } from "@/app/actions/signup.action";
import { useRouter } from "next/navigation";
import { AUTH_ERROR_MESSAGES } from "@/features/auth/constants/errorMessages";

type SignupForm = {
  id: string;
  password: string;
  passwordConfirm: string;
};

export default function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    id?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});
  const [form, setForm] = useState({
    id: "",
    password: "",
    passwordConfirm: "",
  });

  const onChangeField = (name: keyof SignupForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const router = useRouter();

  const onSubmit = async () => {
    if (loading) return;

    setError(null);
    setFieldErrors({});

    const errors: { id?: string; password?: string; passwordConfirm?: string } =
      {};

    if (!isValidId(form.id)) errors.id = AUTH_ERROR_MESSAGES.id;
    if (!isValidPassword(form.password))
      errors.password = AUTH_ERROR_MESSAGES.password;
    if (!isPasswordMatch(form.password, form.passwordConfirm)) {
      errors.passwordConfirm = AUTH_ERROR_MESSAGES.passwordConfirm;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const result = await signupAction(form.id, form.password);

      if (result?.isError) {
        setError(result.message ?? "회원가입 실패");
        return;
      }

      router.replace("/login");
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
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
