import { useId } from "react";
import { type BaseInputProps } from "@/shared/types";

export const BaseInput = ({
  id,
  error = false,
  errorMessage,
  label,
  className = "",
  leftElement,
  rightElement,
  disabled = false,
  ref,
  ...props
}: BaseInputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const getStateClasses = () => {
    if (disabled) {
      return "border-gray cursor-not-allowed text-near-black";
    }
    if (error) {
      return "border-red focus:border-red focus:ring-red/40";
    }
    return "border-light-gray focus:border-sand focus:ring-sand/40";
  };

  const paddingLeft = leftElement ? "pl-14" : "pl-5";
  const paddingRight = rightElement ? "pr-12" : "pr-5";
  const baseClasses = [
    paddingLeft,
    paddingRight,
    "w-full border h-[54px] rounded-md transition-all duration-200 outline-none focus:ring-2 focus:ring-opacity-50 placeholder:text-silver",
    getStateClasses(),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2.5 block text-near-black">
          {label}
        </label>
      )}
      <div className="relative">
        {leftElement && (
          <div className="absolute top-1/2 left-5 -translate-y-1/2 text-cool-gray">
            {leftElement}
          </div>
        )}
        <input
          ref={ref}
          className={baseClasses}
          id={inputId}
          disabled={disabled}
          aria-invalid={error}
          aria-describedby={error && errorMessage ? errorId : undefined}
          {...props}
        />
        {rightElement && (
          <div
            className="absolute top-1/2 right-4 -translate-y-1/2"
            aria-hidden="true"
          >
            {rightElement}
          </div>
        )}
      </div>
      {errorMessage && (
        <p
          id={errorId}
          className="text-xs font-medium mt-1.5 ml-2 text-red"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};

BaseInput.displayName = "BaseInput";
