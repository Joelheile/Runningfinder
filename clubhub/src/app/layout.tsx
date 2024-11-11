import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Metrics from "../components/metrics";
import ReactQueryProvider from "../components/ReactQuery/ReactQueryProvider";
import {Toaster} from "react-hot-toast";

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
        </body>
      </ReactQueryProvider>

    </html>
  );
}
