import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Metrics from "./metrics";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Runningclub Finder",
  description: "We help you find the local clubs in your area",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider >
        <body className={inter.className}>
          {children} <Metrics />
        </body>
      </SessionProvider>
    </html>
  );
}
