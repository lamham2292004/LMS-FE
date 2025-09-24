import { ThemeProvider } from "next-themes";
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/features/auth";

export const metadata: Metadata = {
  title: "HPC Project - Hệ Thống Quản Lý Giáo Dục",
  description: "Hệ thống quản lý giáo dục với Next.js và Laravel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
