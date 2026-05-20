"use client";

import { useState } from "react";
import { useSignupStore } from "@/features/signup/model/store";
import { signupAction } from "@/app/actions/signup.action";
import { useRouter } from "next/navigation";
import { AUTH_ERROR_MESSAGES } from "@/features/auth/constants/errorMessages";

export default function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { form, reset } = useSignupStore();
  const router = useRouter();

  const onSubmit = async () => {
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const result = await signupAction(
        form.name,
        form.email,
        form.phone,
        form.id,
        form.password,
        form.passwordConfirm,
        form.interestCategories,
        form.customInterestCategories,
      );

      if (result?.isError) {
        setError(result.message ?? AUTH_ERROR_MESSAGES.signupFailed);
        return;
      }

      reset();
      router.replace("/login");
    } catch {
      setError(AUTH_ERROR_MESSAGES.signupUnexpected);
    } finally {
      setLoading(false);
    }
  };

  return { onSubmit, loading, error };
}
