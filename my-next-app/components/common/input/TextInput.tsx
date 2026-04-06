import { BaseInput } from "./BaseInput";
import { type BaseInputProps } from "@/types";
export interface TextInputProps extends BaseInputProps {
  /** input type @default 'text' */
  type?: "text" | "email" | "tel" | "url" | "number" | "search";
}

export const TextInput = ({ type = "text", ...props }: TextInputProps) => {
  return <BaseInput type={type} {...props} />;
};

TextInput.displayName = "TextInput";
