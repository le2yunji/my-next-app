// widgets/comments-sheet/ui/BottomSheet.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type BottomSheetProps = {
  children: React.ReactNode;
};

export default function BottomSheet({ children }: BottomSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // 마운트 직후 애니메이션 시작
    const id = requestAnimationFrame(() => {
      setOpen(true);
    });

    // 배경 스크롤 잠금
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setOpen(false);

    setTimeout(() => {
      router.back();
    }, 250); // transition duration과 맞춰주기
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-250 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* sheet */}
      <div
        className={`absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white shadow-2xl transition-transform duration-250 ease-out
          ${open ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
