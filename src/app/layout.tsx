import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AuthProvider from "@/components/Auth/AuthProvider";
import Metrics from "@/components/metrics";
import { TooltipProvider } from "@/components/UI/tooltip";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "react-hot-toast";
import ReactQueryProvider from "../components/ReactQuery/ReactQueryProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RunningFinder",
  description: "We help you find the local clubs in your area",
  icons: {
    icon: "/icons/App Icon.png",
    apple: "/icons/App Icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/App Icon.png" />
        <link rel="apple-touch-icon" href="/icons/App Icon.png" />
      </head>
      <body className={inter.className}>
        <ReactQueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster position="bottom-center" />
              {children}
              <Metrics />
              <Analytics />
              <SpeedInsights />
            </TooltipProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
