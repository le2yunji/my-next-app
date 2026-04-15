"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDetailBoardModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      <div
        aria-label="닫기"
        onClick={handleClose}
        className="absolute inset-0 bg-black/40"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-0 bg-white"
      >
        <div className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200 bg-white px-4">
          <button
            type="button"
            onClick={handleClose}
            className="text-sm font-medium text-gray-700"
          >
            닫기
          </button>

          <h1 className="mx-auto text-base font-semibold">보드 상세</h1>
        </div>

        <div className="h-[calc(100dvh-56px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
