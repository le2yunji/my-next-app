// app/(main)/layout.tsx

import Sidebar from "@/components/common/sidebar/Sidebar";

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
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      {modal}
      {sheet}
    </>
  );
}
