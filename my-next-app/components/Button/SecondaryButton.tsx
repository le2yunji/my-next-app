import type { ReactNode } from "react";
import type { BaseButtonProps } from "@/types";

interface SecondaryButtonProps extends BaseButtonProps {
  icon?: ReactNode;
  active?: boolean;
}
/**
 * SecondaryButton 컴포넌트
 *
 * 로그인/회원가입, 2개 중 선택을 유도하는 버튼 그룹에 사용하는 보조 버튼입니다.
 *
 * ## 특징
 * - 3가지 크기 지원 (sm, md, lg)
 * - 아이콘 지원 (optional)
 * - Active 상태 지원 (Primary 색상으로 변경)
 * - Disabled 상태 지원
 * - 흰색 배경에 회색 테두리 디자인
 * - 호버 시 배경색 변경 (gray-50)
 *
 * @example
 * ```tsx
 * // 기본 사용
 * <SecondaryButton size='md'>Button</SecondaryButton>
 *
 * // 아이콘과 함께
 * <SecondaryButton size='lg' icon={<Icon />}>
 *   Large with Icon
 * </SecondaryButton>
 *
 * // Active 상태
 * <SecondaryButton active>Active State</SecondaryButton>
 * ```
 */
export const SecondaryButton = ({
  children,
  icon,
  size = "md",
  active = false,
  disabled = false,
  className = "",
  ...props
}: SecondaryButtonProps) => {
  // 공통 스타일
  const baseClasses =
    "inline-flex items-center justify-center gap-1 " +
    "cursor-pointer transition-all duration-200 ease-in-out " +
    "leading-none " +
    "disabled:bg-white disabled:text-gray-200 disabled:border-gray-200 disabled:cursor-not-allowed";

  // Active 상태가 아닐 때만 호버 효과
  const hoverClasses = active ? "" : "hover:bg-gray-50";

  // Active 상태 스타일
  const activeClasses = active
    ? "bg-primary-500 text-white"
    : "bg-white text-gray-600 border-gray-200";

  // 폰트 클래스: sm일 때 font-md, 나머지는 font-lg / active일 때 bold, 아니면 medium
  const getFontClass = () => {
    const fontSize = size === "sm" ? "md" : "lg";
    const fontWeight = active ? "bold" : "medium";
    return `font-${fontSize}-${fontWeight}`;
  };

  // 크기별 스타일 (폰트 제외)
  const sizeClasses = {
    lg: "rounded-2xl px-5 py-3 h-[54px]", // 16px radius, 12px 20px padding, 54px height
    md: "rounded-xl px-[18px] py-3.5 h-12", // 14px radius, 14px 18px padding, 48px height
    sm: "rounded-xl px-3 py-1 h-[34px]", // 12px radius, 4px 12px padding, 34px height
  };

  // 아이콘 크기
  const iconSizeClasses = {
    lg: "w-6 h-6", // 24px
    md: "w-5 h-5", // 20px
    sm: "w-4 h-4", // 16px
  };

  const classes = `${baseClasses} ${activeClasses} ${hoverClasses} ${sizeClasses[size]} ${getFontClass()} border ${className}`;

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
