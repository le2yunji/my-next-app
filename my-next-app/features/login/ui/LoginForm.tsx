"use client";

import useLogin from "../model/useLogin";
import { PrimaryButton } from "@/shared/ui/button/PrimaryButton";
import { TextInput } from "@/shared/ui/input/TextInput";
import Link from "next/link";

export default function LoginForm() {
  const { form, onChangeField, onSubmit, loading, error, fieldErrors } =
    useLogin();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
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

        <PrimaryButton size="lg" className="mb-2" type="submit">
          {loading ? "로그인 중..." : "로그인하기"}
        </PrimaryButton>
        <div className="flex items-center justify-center gap-1">
          <span className="text-silver">계정이 없으신가요?</span>
          <Link href={"/signup"} className="text-black">
            회원가입
          </Link>
        </div>
      </div>
    </form>
  );
}
