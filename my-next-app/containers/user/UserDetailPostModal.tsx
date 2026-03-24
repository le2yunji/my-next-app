"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserDetailPostModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setOpen(true);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      router.back();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      <button
        type="button"
        aria-label="닫기"
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-0 bg-white transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200 bg-white px-4">
          <button
            type="button"
            onClick={handleClose}
            className="text-sm font-medium text-gray-700"
          >
            닫기
          </button>

          <h1 className="mx-auto text-base font-semibold">게시물 상세</h1>
        </div>

        <div className="h-[calc(100dvh-56px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
