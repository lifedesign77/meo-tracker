import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MEO Tracker",
  description: "Google Maps Local Search Ranking Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} flex h-screen overflow-hidden bg-background`}>
        <Sidebar className="hidden md:flex" />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
