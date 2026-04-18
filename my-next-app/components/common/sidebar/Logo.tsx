type LogoVariant = "full" | "compact" | "compact-plain";

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}

export default function Logo({ variant = "full", className = "" }: LogoProps) {
  if (variant === "compact") {
    return (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="MUTE"
      >
        <rect width="36" height="36" rx="10" fill="#1A1A1A" />
        <path
          d="M8 26V10H11.5L18 20.5L24.5 10H28V26H24.5V16.5L18 26.5L11.5 16.5V26H8Z"
          fill="#F5F0E8"
        />
      </svg>
    );
  }

  if (variant === "compact-plain") {
    return (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="MUTE"
      >
        <rect
          x="1"
          y="1"
          width="34"
          height="34"
          rx="9"
          stroke="#1A1A1A"
          strokeWidth="1.5"
        />
        <path
          d="M8 26V10H11.5L18 20.5L24.5 10H28V26H24.5V16.5L18 26.5L11.5 16.5V26H8Z"
          fill="#1A1A1A"
        />
      </svg>
    );
  }

  return (
    <svg
      width="80"
      height="28"
      viewBox="0 0 80 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="MUTE"
    >
      <text
        x="0"
        y="22"
        fontFamily="'Helvetica Neue', Arial, sans-serif"
        fontSize="24"
        fontWeight="700"
        letterSpacing="3"
        fill="#1A1A1A"
      >
        MUTE
      </text>
    </svg>
  );
}
