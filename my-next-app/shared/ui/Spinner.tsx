// shared/ui/Spinner.tsx

type SpinnerProps = {
  size?: number;
  className?: string;
  label?: string;
};

export default function Spinner({
  size = 20,
  className = "",
  label = "로딩 중",
}: SpinnerProps) {
  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label={label}
    >
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-25"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="opacity-90"
        />
      </svg>

      <span className="sr-only">{label}</span>
    </div>
  );
}
