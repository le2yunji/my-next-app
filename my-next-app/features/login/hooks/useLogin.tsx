"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { isValidId, isValidPassword } from "@/features/auth/model/validators";
import { loginAction } from "@/app/actions/login.action";

export default function useLogin() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [fieldErrors, setFieldErrors] = useState<{
    id?: string;
    password?: string;
  }>({});

  const onSubmit = async () => {
    if (loading) return;

    setError(null);
    setFieldErrors({});

    const errors: { id?: string; password?: string } = {};

    if (!isValidId(id)) errors.id = "아이디는 영문+숫자 조합 2~8자여야 합니다.";

    if (!isValidPassword(password))
      errors.password = "비밀번호는 영문+숫자 포함 8~16자여야 합니다.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const result = await loginAction(id, password);

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
    id,
    password,
    setId,
    setPassword,
    onSubmit,
    loading,
    error,
    fieldErrors,
  };
}
