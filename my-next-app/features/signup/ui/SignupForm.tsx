"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSignupStore } from "@/features/signup/model/store";
import SignupStepIndicator from "./SignupStepIndicator";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2AccountInfo from "./steps/Step2AccountInfo";
import Step3Categories from "./steps/Step3Categories";
import Link from "next/link";

const STEP_TITLES: Record<number, string> = {
  1: "기본 정보 입력",
  2: "계정 정보 입력",
  3: "관심 카테고리 선택",
};

export default function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { form } = useSignupStore();

  const rawStep = Number(searchParams.get("step") ?? "1");
  const currentStep = [1, 2, 3].includes(rawStep) ? rawStep : 1;

  // 스텝 직접 접근 방지: 이전 스텝 데이터가 없으면 해당 스텝으로 복귀
  useEffect(() => {
    if (currentStep === 2 && !form.name) {
      router.replace("/signup?step=1");
    }
    if (currentStep === 3 && !form.id) {
      router.replace("/signup?step=1");
    }
    if (currentStep === 3 && form.id && !form.password) {
      router.replace("/signup?step=2");
    }
  }, [currentStep, form.name, form.id, form.password, router]);

  return (
    <div>
      <SignupStepIndicator currentStep={currentStep} />
      <h2 className="mb-6 text-lg font-semibold text-near-black">
        {STEP_TITLES[currentStep]}
      </h2>

      {currentStep === 1 && <Step1BasicInfo />}
      {currentStep === 2 && <Step2AccountInfo />}
      {currentStep === 3 && <Step3Categories />}

      {currentStep === 1 && (
        <div className="mt-6 flex items-center justify-center gap-1">
          <span className="text-silver">계정이 있으신가요?</span>
          <Link href="/login" className="text-black">
            로그인
          </Link>
        </div>
      )}
    </div>
  );
}
