// app/(main)/layout.tsx

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
      {children}
      {modal}
      {sheet}
    </>
  );
}
