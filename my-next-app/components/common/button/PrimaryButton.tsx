import { type BaseButtonProps } from "@/types";

export const PrimaryButton = ({
  children,
  size = "md",
  disabled = false,
  ignoreSize = false,
  className = "",
  ...props
}: BaseButtonProps & { ignoreSize?: boolean }) => {
  const sizeClasses = {
    lg: "h-[50px] px-6 py-3.5 rounded-lg text-md font-bold",
    md: "h-10 px-5 py-3.5 rounded-md text-md font-bold",
    sm: "h-[34px] px-4 py-3 rounded-md text-sm font-bold",
  };

  const baseClasses =
    "inline-flex items-center justify-center bg-black text-white border-none cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 disabled:bg-light-gray disabled:text-silver disabled:opacity-60 disabled:cursor-not-allowed leading-none";

  return (
    <button
      // ignoreSize 시 size·font 클래스 모두 외부 className에 위임
      className={`${baseClasses} ${ignoreSize ? "" : sizeClasses[size]} ${className}`}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};
