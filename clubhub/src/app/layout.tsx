import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Metrics from "../components/metrics";
import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "../components/ReactQueryProvider";

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
      {/* <SessionProvider> */}
      <ReactQueryProvider>
        <body className={inter.className}>
          {children} <Metrics />
        </body>
      </ReactQueryProvider>
      {/* </SessionProvider> */}
    </html>
  );
}
