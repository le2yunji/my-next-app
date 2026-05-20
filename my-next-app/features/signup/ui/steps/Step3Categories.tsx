"use client";

import { useState, KeyboardEvent } from "react";
import { PrimaryButton } from "@/shared/ui/button/PrimaryButton";
import { SecondaryButton } from "@/shared/ui/button/SecondaryButton";
import { useSignupStore } from "@/features/signup/model/store";
import { useSignupStep3 } from "@/features/signup/model/useSignupStep";
import { INTEREST_CATEGORIES } from "@/entities/user";
import useSignup from "@/features/signup/model/useSignup";

export default function Step3Categories() {
  const { form, setField } = useSignupStore();
  const { goBack } = useSignupStep3();
  const { onSubmit, loading, error } = useSignup();

  const [customInput, setCustomInput] = useState("");

  const toggleCategory = (category: string) => {
    const current = form.interestCategories;
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setField("interestCategories", updated);
  };

  const addCustomCategory = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (form.customInterestCategories.includes(trimmed)) return;
    setField("customInterestCategories", [
      ...form.customInterestCategories,
      trimmed,
    ]);
    setCustomInput("");
  };

  const removeCustomCategory = (category: string) => {
    setField(
      "customInterestCategories",
      form.customInterestCategories.filter((c) => c !== category),
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomCategory();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-3 text-near-black">관심 카테고리</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_CATEGORIES.map((category) => {
            const isSelected = form.interestCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-light-gray bg-white text-near-black hover:border-black"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-near-black">찾으시는 키워드가 없으신가요 ?</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="카테고리 입력 후 Enter 또는 추가"
            className="h-[54px] flex-1 rounded-md border border-light-gray px-5 placeholder:text-silver focus:border-sand focus:ring-2 focus:ring-sand/40 focus:outline-none"
          />
          <SecondaryButton size="lg" onClick={addCustomCategory}>
            추가
          </SecondaryButton>
        </div>
        {form.customInterestCategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {form.customInterestCategories.map((category) => (
              <span
                key={category}
                className="flex items-center gap-1.5 rounded-full border border-light-gray bg-white px-4 py-1.5 text-sm font-medium text-near-black"
              >
                {category}
                <button
                  type="button"
                  onClick={() => removeCustomCategory(category)}
                  className="text-silver transition-colors hover:text-black"
                  aria-label={`${category} 삭제`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <SecondaryButton size="lg" className="flex-1" onClick={goBack}>
          이전
        </SecondaryButton>
        <PrimaryButton
          size="lg"
          className="flex-1"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "회원가입 중..." : "회원가입 하기"}
        </PrimaryButton>
      </div>
    </div>
  );
}
