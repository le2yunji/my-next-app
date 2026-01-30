import type { ReactNode, Ref } from "react";

export interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export type ButtonSize = "lg" | "md" | "sm";
export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
}

export interface LoginRequest {
  id: string;
  password: string;
}
export interface LoginResponse {}
