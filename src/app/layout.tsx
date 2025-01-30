import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ModalPortal } from "@/shared/ui/ModalPortal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Business Card Maker",
  description: "Create your own business card",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        {children}
        <ModalPortal />
      </body>
    </html>
  );
}
