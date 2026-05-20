// app/layout.tsx
import "@/app/styles/globals.css";
import AuthInitializer from "@/app/providers/auth/AuthInitializer";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AuthInitializer />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
