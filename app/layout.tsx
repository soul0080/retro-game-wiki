import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Retro Game Wiki - 中文经典游戏百科站",
    template: "%s | Retro Game Wiki",
  },
  description:
    "中文经典游戏知识库 - 提供 FC/SFC/GBA/PS1 等平台的攻略 Wiki、模拟器教程、游戏数据库",
  keywords: ["经典游戏", "复古游戏", "游戏攻略", "模拟器", "FC", "SFC", "GBA", "PS1", "RPG"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
