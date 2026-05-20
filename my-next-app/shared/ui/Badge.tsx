import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  icon?: ReactNode;
}

export default function Badge({ children, icon }: BadgeProps) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#FFD6A8] bg-[#FFD6A8]/20 px-2 py-0.5 text-[12px] font-medium whitespace-nowrap text-[#F54900] sm:px-2.5 sm:text-xs">
      {icon && (
        <span className="inline-flex items-center justify-center w-3.5 h-3.5">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
