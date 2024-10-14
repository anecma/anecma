import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/auth/next-auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anecma - Kehamilan Terpantau, Anemia Tercegah",
  description: "Kehamilan Terpantau, Anemia Tercegah",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png?v=4",
    shortcut: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} bg-white-background`}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
