const STEPS = ["기본 정보", "계정 정보", "관심 카테고리"];

type Props = {
  currentStep: number;
};

export default function SignupStepIndicator({ currentStep }: Props) {
  return (
    <div className="mb-8 flex items-center justify-between">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  isCompleted
                    ? "bg-black text-white"
                    : isActive
                      ? "bg-black text-white"
                      : "bg-light-gray text-silver"
                }`}
              >
                {isCompleted ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 7L5.5 10.5L12 4"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-xs ${isActive ? "font-semibold text-black" : "text-silver"}`}
              >
                {label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div
                className={`mx-2 mb-5 h-px flex-1 transition-colors ${
                  isCompleted ? "bg-black" : "bg-light-gray"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
