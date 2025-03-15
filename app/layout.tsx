import { ReactNode } from "react";
import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whiteboard - Interactive Teaching Tool",
  description:
    "A simple browser-based whiteboard for teachers, built with Next.js, React, and Fabric.js. Features include drawing, color selection, and adjustable line thickness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable}  antialiased`}>{children}</body>
    </html>
  );
}
