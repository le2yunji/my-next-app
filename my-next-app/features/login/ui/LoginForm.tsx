"use client";

import { TextInput } from "@/components/input/TextInput";
import useLogin from "../hooks/useLogin";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/components/button/PrimaryButton";

export default function LoginForm() {
  const router = useRouter();

  const {
    form,
    setForm,
    onChangeField,
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
          id="identifier"
          label="전화번호, 사용자 이름, 혹은 이메일"
          placeholder="전화번호, 사용자 이름, 혹은 이메일"
          value={form.identifier}
          onChange={(e) => onChangeField("identifier", e.target.value)}
        />
        <p className="text-red-500">{fieldErrors.identifier}</p>
        <TextInput
          id="password"
          label="비밀번호"
          placeholder="비밀번호"
          value={form.password}
          onChange={(e) => onChangeField("password", e.target.value)}
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
