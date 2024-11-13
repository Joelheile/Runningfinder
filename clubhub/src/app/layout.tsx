import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import ReactQueryProvider from "../components/ReactQuery/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import Metrics from "@/components/metrics";
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
      <ReactQueryProvider>
        <body className={inter.className}>
          <Toaster position="bottom-center" />
          {children} <Metrics />
          <Analytics />
        </body>
      </ReactQueryProvider>
    </html>
  );
}
