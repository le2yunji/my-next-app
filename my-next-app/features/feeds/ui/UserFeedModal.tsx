/**
 * 유저 피드 모달 껍데기 컴포넌트.
 * @modal 병렬 라우트에서 유저 피드 페이지를 오버레이로 보여줄 때 사용.
 * 우측에서 슬라이드인되는 풀스크린 패널이며, 닫기 시 router.back()으로 복귀.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function UserFeedModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const savedScroll = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setOpen(true);
    });
    const prevOverflow = document.body.style.overflow;
    savedScroll.current = { x: window.scrollX, y: window.scrollY };
    document.body.style.overflow = "hidden";
    // 닫기 버튼 / router.back() 으로 컴포넌트가 언마운트될 때 복원
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = prevOverflow;
      if (savedScroll.current) {
        window.scrollTo(savedScroll.current.x, savedScroll.current.y);
        savedScroll.current = null;
      }
    };
  }, []);

  // soft navigation으로 /users/* 밖으로 이동하면 @modal 슬롯이 리셋되지 않으므로
  // pathname 기반으로 open 상태를 파생해 슬라이드아웃 처리
  const isOnUserPath = pathname.startsWith("/users/");
  const isOpen = open && isOnUserPath;

  // 홈 등 다른 경로로 이동 시 overflow·스크롤 복원 (컴포넌트는 언마운트 안 됨)
  useEffect(() => {
    if (!isOnUserPath && savedScroll.current) {
      document.body.style.overflow = "";
      window.scrollTo(savedScroll.current.x, savedScroll.current.y);
      savedScroll.current = null;
    }
  }, [isOnUserPath]);

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      router.back();
    }, 300);
  };

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-9999 md:left-20 lg:left-50">
      <button
        aria-label="닫기"
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`absolute inset-0 bg-white transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-[calc(100dvh-56px)] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
