import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cipher Identifier & Cracker",
  description: "Identify and crack common encodings like Base64, Hex, Binary, Morse, and Caesar ciphers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex bg-zinc-950">
        <Sidebar />
        <main className="flex-1 lg:pl-64 min-h-screen">
          <div className="h-full flex flex-col">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
