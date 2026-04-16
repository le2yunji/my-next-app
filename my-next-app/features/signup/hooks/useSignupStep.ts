"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignupStore } from "@/stores/useSignupStore";
import {
  isValidName,
  isValidEmail,
  isValidPhone,
  isValidId,
  isValidPassword,
  isPasswordMatch,
} from "@/features/auth/validation/validators";
import { AUTH_ERROR_MESSAGES } from "@/features/auth/constants/errorMessages";

type Step1Errors = Partial<Record<"name" | "email" | "phone", string>>;
type Step2Errors = Partial<Record<"id" | "password" | "passwordConfirm", string>>;

export function useSignupStep1() {
  const { form } = useSignupStore();
  const router = useRouter();
  const [errors, setErrors] = useState<Step1Errors>({});

  const goNext = () => {
    const next: Step1Errors = {};
    if (!isValidName(form.name)) next.name = AUTH_ERROR_MESSAGES.name;
    if (!isValidEmail(form.email)) next.email = AUTH_ERROR_MESSAGES.email;
    if (!isValidPhone(form.phone)) next.phone = AUTH_ERROR_MESSAGES.phone;

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    router.push("/signup?step=2");
  };

  return { errors, setErrors, goNext };
}

export function useSignupStep2() {
  const { form } = useSignupStore();
  const router = useRouter();
  const [errors, setErrors] = useState<Step2Errors>({});

  const goNext = () => {
    const next: Step2Errors = {};
    if (!isValidId(form.id)) next.id = AUTH_ERROR_MESSAGES.id;
    if (!isValidPassword(form.password))
      next.password = AUTH_ERROR_MESSAGES.password;
    if (!isPasswordMatch(form.password, form.passwordConfirm))
      next.passwordConfirm = AUTH_ERROR_MESSAGES.passwordConfirm;

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    router.push("/signup?step=3");
  };

  const goBack = () => router.push("/signup?step=1");

  return { errors, setErrors, goNext, goBack };
}

export function useSignupStep3() {
  const router = useRouter();
  const goBack = () => router.push("/signup?step=2");
  return { goBack };
}
