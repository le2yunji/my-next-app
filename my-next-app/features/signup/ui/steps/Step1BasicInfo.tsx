"use client";

import { TextInput } from "@/components/common/input/TextInput";
import { PrimaryButton } from "@/components/common/button/PrimaryButton";
import { useSignupStore } from "@/stores/useSignupStore";
import { useSignupStep1 } from "@/features/signup/hooks/useSignupStep";

export default function Step1BasicInfo() {
  const { form, setField } = useSignupStore();
  const { errors, goNext } = useSignupStep1();

  return (
    <div className="flex flex-col gap-3">
      <TextInput
        id="name"
        label="이름"
        placeholder="이름"
        value={form.name}
        onChange={(e) => setField("name", e.target.value)}
        error={!!errors.name}
        errorMessage={errors.name}
      />
      <TextInput
        id="email"
        label="이메일"
        placeholder="이메일"
        value={form.email}
        onChange={(e) => setField("email", e.target.value)}
        error={!!errors.email}
        errorMessage={errors.email}
      />
      <TextInput
        id="phone"
        type="tel"
        label="휴대전화"
        placeholder="휴대전화"
        value={form.phone}
        onChange={(e) => setField("phone", e.target.value)}
        error={!!errors.phone}
        errorMessage={errors.phone}
      />
      <PrimaryButton size="lg" className="mt-3" onClick={goNext}>
        다음
      </PrimaryButton>
    </div>
  );
}
