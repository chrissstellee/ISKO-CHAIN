import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import "remixicon/fonts/remixicon.css";
import Providers from '@/lib/providers'; // 👈 Import the wrapper you just created

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PUPQCHAIN",
  description: "Blockchain-Based Academic Credential Verification System",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers> {/* ✅ Now wraps in client-side context */}
      </body>
    </html>
  );
}
