"use client";

import { TextInput } from "@/components/common/input/TextInput";
import { PrimaryButton } from "@/components/common/button/PrimaryButton";
import useSignup from "../hooks/useSignup";
import Link from "next/link";

export default function SignupForm() {
  const { form, onChangeField, onSubmit, loading, error, fieldErrors } =
    useSignup();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        <TextInput
          id="name"
          label="이름"
          placeholder="이름"
          value={form.name}
          onChange={(e) => onChangeField("name", e.target.value)}
        />
        <TextInput
          id="email"
          label="이메일"
          placeholder="이메일"
          value={form.email}
          onChange={(e) => onChangeField("email", e.target.value)}
        />
        <TextInput
          id="phone"
          type="tel"
          label="휴대전화"
          placeholder="휴대전화"
          value={form.phone}
          onChange={(e) => onChangeField("phone", e.target.value)}
        />
        <TextInput
          id="id"
          label="아이디"
          placeholder="아이디"
          value={form.id}
          onChange={(e) => onChangeField("id", e.target.value)}
        />
        <p className="text-red-500">{fieldErrors.id}</p>
        <TextInput
          id="password"
          label="비밀번호"
          placeholder="비밀번호"
          value={form.password}
          onChange={(e) => onChangeField("password", e.target.value)}
        />
        <p className="text-red-500">{fieldErrors.password}</p>
        <TextInput
          id="passwordConfirm"
          label="비밀번호 확인"
          placeholder="비밀번호 확인"
          value={form.passwordConfirm}
          onChange={(e) => onChangeField("passwordConfirm", e.target.value)}
        />
        <p className="text-red-500">{fieldErrors.passwordConfirm}</p>
        {error && <p className="text-red-500">{error}</p>}
        <PrimaryButton size="lg" className="mb-3" type="submit">
          {loading ? "회원가입 중..." : "회원가입 하기"}
        </PrimaryButton>
      </div>
      <div className="flex items-center justify-center gap-1">
        <span className="text-silver">계정이 있으신가요?</span>
        <Link href={"/login"} className="text-black">
          로그인
        </Link>
      </div>
    </form>
  );
}
