// app/(main)/layout.tsx

import Sidebar from "@/components/common/sidebar/Sidebar";
import { Toaster } from "sonner";

export default function MainLayout({
  children,
  modal,
  sheet,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  sheet: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto flex min-h-screen max-w-screen-2xl">
        <Sidebar />
        {/* 모바일: 상단 헤더(h-14) + 하단 바(h-16) 만큼 패딩 */}
        <main className="min-w-0 flex-1 pb-16 pt-14 md:pb-0 md:pt-0">
          {children}
        </main>
      </div>
      {modal}
      {sheet}
      <Toaster position="bottom-center" />
    </>
  );
}
