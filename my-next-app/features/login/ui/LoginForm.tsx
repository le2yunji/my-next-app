"use client";

import { TextInput } from "@/components/Input/TextInput";
import useLogin from "../hooks/useLogin";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/Button/PrimaryButton";

export default function LoginForm() {
  const router = useRouter();

  const {
    id,
    password,
    setId,
    setPassword,
    onSubmit,
    loading,
    error,
    fieldErrors,
  } = useLogin();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <TextInput
          id="id"
          label="아이디"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <p className="text-red-500">{fieldErrors.id}</p>
        <TextInput
          id="password"
          label="비밀번호"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-red-500">{fieldErrors.password}</p>

        {error && <p className="text-red-500">{error}</p>}

        <PrimaryButton ignoreSize className="h-10 rounded-lg" type="submit">
          {loading ? "로그인 중..." : "로그인하기"}
        </PrimaryButton>

        <button
          className="h-10 rounded-lg"
          type="button"
          onClick={() => router.push("/signup")}
        >
          회원가입 하기
        </button>
      </div>
    </form>
  );
}
