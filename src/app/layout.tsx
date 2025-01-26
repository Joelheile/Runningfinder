import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Metrics from "@/components/metrics";
import { TooltipProvider } from "@/components/UI/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "../components/ReactQuery/ReactQueryProvider";
import AuthProvider from "@/components/Auth/AuthProvider";
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
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster position="bottom-center" />
              {children}
              <Metrics />
              <Analytics />
            </TooltipProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
