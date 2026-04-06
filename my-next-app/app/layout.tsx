import "@/styles/globals.css";
import AuthInitializer from "@/features/auth/ui/AuthInitializer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
