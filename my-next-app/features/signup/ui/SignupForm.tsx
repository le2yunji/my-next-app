"use client";

import { TextInput } from "@/components/Input/TextInput";
import { PrimaryButton } from "@/components/Button/PrimaryButton";
import useSignup from "../hooks/useSignup";

export default function SignupForm() {
  const {
    form,
    setForm,
    onChangeField,
    onSubmit,
    loading,
    error,
    fieldErrors,
  } = useSignup();

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
        <PrimaryButton ignoreSize className="h-10 rounded-lg" type="submit">
          {loading ? "회원가입 중..." : "회원가입 하기"}
        </PrimaryButton>
      </div>
    </form>
  );
}
