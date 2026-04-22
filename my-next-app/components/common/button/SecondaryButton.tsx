import type { ReactNode } from "react";
import type { BaseButtonProps } from "@/types";

interface SecondaryButtonProps extends BaseButtonProps {
  icon?: ReactNode;
  active?: boolean;
}

export const SecondaryButton = ({
  children,
  icon,
  size = "md",
  active = false,
  disabled = false,
  ignoreSize = false,
  className = "",
  ...props
}: SecondaryButtonProps & { ignoreSize?: boolean }) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-1 " +
    "cursor-pointer transition-all duration-200 ease-in-out " +
    "leading-none " +
    "disabled:bg-white disabled:text-light-gray disabled:border-light-gray disabled:cursor-not-allowed";

  const hoverClasses = active ? "" : "hover:bg-warm-white";

  const activeClasses = active
    ? "bg-rust text-white"
    : "bg-white text-cool-gray border-light-gray";

  const getFontClasses = () => {
    const fontSize = size === "sm" ? "text-sm" : "text-md";
    const fontWeight = active ? "font-bold" : "font-medium";
    return `${fontSize} ${fontWeight}`;
  };

  const sizeClasses = {
    lg: "rounded-2xl px-5 py-3 h-[54px]",
    md: "rounded-xl px-[18px] py-3.5 h-12",
    sm: "rounded-xl px-3 py-1 h-[34px]",
  };

  const iconSizeClasses = {
    lg: "w-6 h-6",
    md: "w-5 h-5",
    sm: "w-4 h-4",
  };

  // ignoreSize 시 폰트 클래스도 외부 className에 위임
  const classes = `${baseClasses} ${activeClasses} ${hoverClasses} ${ignoreSize ? "" : `${sizeClasses[size]} ${getFontClasses()}`} border ${className}`;

  return (
    <button className={classes} disabled={disabled} type="button" {...props}>
      {icon && (
        <span
          className={`inline-flex items-center justify-center ${iconSizeClasses[size]}`}
        >
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
};
