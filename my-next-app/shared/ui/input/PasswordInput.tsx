import { useState } from "react";
import { BaseInput } from "./BaseInput";
import { type BaseInputProps } from "@/shared/types";
// import { PasswordHidden, PasswordShow } from '@/assets/icons';

export interface PasswordInputProps extends Omit<
  BaseInputProps,
  "type" | "rightElement"
> {
  /** 비밀번호 보기/숨기기 토글 표시 여부 @default true */
  showToggle?: boolean;
}

export const PasswordInput = ({
  showToggle = true,
  ...props
}: PasswordInputProps) => {
  const toggleButton = showToggle ? (
    <button
      type="button"
      className="text-cool-gray transition-colors hover:text-slate"
    >
      {/* {showPassword ? <PasswordShow /> : <PasswordHidden />} */}
    </button>
  ) : undefined;

  return <BaseInput {...props} />;
};

PasswordInput.displayName = "PasswordInput";
