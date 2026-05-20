"use client";

import { TextInput } from "@/shared/ui/input/TextInput";

import { PrimaryButton } from "@/shared/ui/button/PrimaryButton";
import { SecondaryButton } from "@/shared/ui/button/SecondaryButton";
import { useSignupStore } from "@/features/signup/model/store";
import { useSignupStep2 } from "@/features/signup/model/useSignupStep";
import { PasswordInput } from "@/shared/ui/input/PasswordInput";

export default function Step2AccountInfo() {
  const { form, setField } = useSignupStore();
  const { errors, goNext, goBack } = useSignupStep2();

  return (
    <div className="flex flex-col gap-3">
      <TextInput
        id="id"
        label="아이디"
        placeholder="아이디"
        value={form.id}
        onChange={(e) => setField("id", e.target.value)}
        error={!!errors.id}
        errorMessage={errors.id}
      />
      <PasswordInput
        id="password"
        label="비밀번호"
        placeholder="비밀번호"
        value={form.password}
        onChange={(e) => setField("password", e.target.value)}
        error={!!errors.password}
        errorMessage={errors.password}
      />
      <PasswordInput
        id="passwordConfirm"
        label="비밀번호 확인"
        placeholder="비밀번호 확인"
        value={form.passwordConfirm}
        onChange={(e) => setField("passwordConfirm", e.target.value)}
        error={!!errors.passwordConfirm}
        errorMessage={errors.passwordConfirm}
      />
      <div className="mt-3 flex gap-3">
        <SecondaryButton size="lg" className="flex-1" onClick={goBack}>
          이전
        </SecondaryButton>
        <PrimaryButton size="lg" className="flex-1" onClick={goNext}>
          다음
        </PrimaryButton>
      </div>
    </div>
  );
}
