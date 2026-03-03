"use client";

import { useState } from "react";

import {
  isValidId,
  isValidPassword,
  isPasswordMatch,
} from "@/features/auth/model/validators";
import { signupAction } from "@/app/actions/signup.action";
import { useRouter } from "next/navigation";

export default function useSignup() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    id?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});

  const router = useRouter();

  const onSubmit = async () => {
    if (loading) return;

    setError(null);
    setFieldErrors({});

    const errors: { id?: string; password?: string; passwordConfirm?: string } =
      {};

    if (!isValidId(id)) errors.id = "아이디는 영문+숫자 조합 2~8자여야 합니다.";

    if (!isValidPassword(password))
      errors.password = "비밀번호는 영문+숫자 포함 8~16자여야 합니다.";

    if (!isPasswordMatch(password, passwordConfirm))
      errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const result = await signupAction(id, password);

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
    id,
    setId,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    onSubmit,
    loading,
    error,
    fieldErrors,
  };
}
